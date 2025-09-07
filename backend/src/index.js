import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import logger, { logStream } from './config/logger.js';

import { appErrorHandler, genericErrorHandler, notFound } from './middlewares/error.middleware.js';

// Routes
import stockDataRoutes from './routes/stockData.routes.js';
import companyDataRoutes from './routes/companyData.routes.js';
import bhavcopyDataRoutes from './routes/bhavcopyDataRoutes.js';
import formularoutes from './routes/formula.routes.js';
import financialDataRoutes from './routes/financialData.routes.js';

// DB connections
import { sequelizeStockMarket, sequelizeBhavcopy, sequelizeThirdDB, sequelizeScreener } from './models/index.js';

// Init app
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));
app.use(morgan('combined', { stream: logStream }));

// DB connections
(async () => {
  try {
    console.log("Starting DB connections...");

    await sequelizeStockMarket.authenticate();
    logger.info('✅ Connected to stock_market database.');
    await sequelizeStockMarket.sync();
    logger.info('✅ stock_market database synced.');

    await sequelizeBhavcopy.authenticate();
    logger.info('✅ Connected to bhavcopy database.');
    await sequelizeBhavcopy.sync();
    logger.info('✅ bhavcopy database synced.');

    await sequelizeScreener.authenticate();
    logger.info('✅ Connected to screener_data database.');
    await sequelizeScreener.sync();
    logger.info('✅ screener_data database synced.');

    const PORT = process.env.APP_PORT || 8000;
    const HOST = process.env.APP_HOST || 'localhost';

    app.listen(PORT, () => {
      logger.info(`🚀 Server running on ${HOST}:${PORT}/vap/`);
      console.log(`🚀 Server running on ${HOST}:${PORT}/vap/`);
    });
  } catch (error) {
    logger.error('❌ Database connection or sync failed:', error);
    console.error('❌ Database connection or sync failed:', error);
    process.exit(1);
  }
})();

// Routes
app.use('/vap/stocks', stockDataRoutes);
app.use('/vap/company-data', companyDataRoutes);
app.use('/vap/bhavcopy', bhavcopyDataRoutes);
app.use('/vap/formula', formularoutes);
app.use('/vap/financial-data', financialDataRoutes);

app.get('/vap/welcome', (req, res) => {
  res.send('📂 Welcome to the Corporate Events Ingestion API.');
});

// Error Handlers
app.use(appErrorHandler);
app.use(genericErrorHandler);
app.use(notFound);

export default app;
