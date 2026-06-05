import express from 'express';
import cors from 'cors';
import { configDotenv } from 'dotenv';
import router from '../routes/index.js';
import ErrorHandler from '../middleware/error.js';

configDotenv();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/api', router);
app.use(ErrorHandler);

export default app;