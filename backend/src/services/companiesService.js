import { AllCompaniesData, ListedCompanies } from "../models/index.js";
import { Op, literal } from "sequelize";

// Rally attempt day 
function checkRallyAttemptDay(data) {
    let results = [];
    const grouped = data.reduce((acc, row) => {
        if (!acc[row.symbol]) acc[row.symbol] = [];
        acc[row.symbol].push(row);
        return acc;
    }, {});

    for (let symbol in grouped) {
        let companyData = grouped[symbol];
        if (companyData.length < 2) continue;

        let today = companyData[companyData.length - 1];
        let prev = companyData[companyData.length - 2];

        let cond1 = today.close > today.open * 1.02;
        let cond2 = today.close > prev.close;
        let cond3 = today.open < prev.close;
        let cond4 = today.volume > prev.volume * 1.5;
        let cond5 = (today.high - today.close) / today.high <= 0.01;

        if (cond1 && cond2 && cond3 && cond4 && cond5) {
            results.push({
                symbol: today.symbol,
                date: today.date,
                close: today.close,
                open: today.open,
                volume: today.volume
            });
        }
    }
    return results;
}

// Follow Through Day
function checkFollowThroughDay(data) {
    let results = [];
    const grouped = data.reduce((acc, row) => {
        if (!acc[row.symbol]) acc[row.symbol] = [];
        acc[row.symbol].push(row);
        return acc;
    }, {});

    for (let symbol in grouped) {
        let companyData = grouped[symbol];
        for (let i = 5; i < companyData.length; i += 10) {
            results.push({ symbol, date: companyData[i].date });
        }
    }
    return results;
}

// Buy Day
function checkBuyDay(data) {
    let results = [];
    data.forEach(row => {
        if (row.close > row.open * 1.05) {
            results.push({ symbol: row.symbol, date: row.date });
        }
    });
    return results;
}

// Service method: fetch + analyze
export async function analyzeCompanies() {
    const allSymbols = await ListedCompanies.findAll({
        attributes: ['symbol'],
        raw: true
    });

    let latestData = [];
    for (const { symbol } of allSymbols) {
        const firstRecord = await AllCompaniesData.findOne({
            where: { symbol },
            order: [['date', 'DESC']],
            raw: true
        });
        if (firstRecord) latestData.push(firstRecord);
    }

    if (!latestData.length) {
        return {
            RallyAttemptDay: [],
            FollowThroughDay: [],
            BuyDay: [],
            checkedSymbolsCount: 0
        };
    }

    return {
        RallyAttemptDay: checkRallyAttemptDay(latestData),
        FollowThroughDay: checkFollowThroughDay(latestData),
        BuyDay: checkBuyDay(latestData),
        checkedSymbolsCount: new Set(latestData.map(row => row.symbol)).size
    };
}
