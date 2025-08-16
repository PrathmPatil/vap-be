import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import logger, { logStream } from './config/logger.js';

import { appErrorHandler, genericErrorHandler, notFound } from './middlewares/error.middleware.js';

import stockDataRoutes from './routes/stockData.routes.js';
import companyDataRoutes from './routes/companyData.routes.js';
import bhavcopyDataRoutes from './routes/bhavcopyDataRoutes.js';
import formularoutes from './routes/formula.routes.js';
import { sequelizeStockMarket, sequelizeBhavcopy } from './models/index.js';

// Init app
const app = express();
const PORT= process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));
app.use(morgan('combined', { stream: logStream }));

// Choose the DB to connect based on routes or your preference
// Example: connect both and sync both separately (optional)

(async () => {
  try {
    console.log("Starting DB connections...");
    await sequelizeStockMarket.authenticate();
    logger.info('✅ Connected to stock_market database.');
    await sequelizeStockMarket.sync();
    logger.info('✅ stock_market database synced.');

    console.log("Starting bhavcopy DB connect...");
    await sequelizeBhavcopy.authenticate();
    logger.info('✅ Connected to bhavcopy database.');

    console.log("Starting bhavcopy DB sync...");
    // Comment this line to test startup speed if needed:
    await sequelizeBhavcopy.sync();
    console.log("Bhavcopy DB sync done.");
    logger.info('✅ bhavcopy database synced.');

    console.log("Starting server listen...");
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
app.get('/vap/welcome', (req, res) => {
  res.send('📂 Welcome to the Corporate Events Ingestion API.');
});

// Error Handlers
app.use(appErrorHandler);
app.use(genericErrorHandler);
app.use(notFound);

export default app;