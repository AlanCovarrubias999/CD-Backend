import app from './app.js';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv/config.js';

app.listen(process.env.PORT);
connectDB();
