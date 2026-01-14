import app from './app.js';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv/config.js';

app.listen(process.env.PORT);
connectDB();
console.log('Servidor establecido en: http://localhost:' + process.env.PORT);
