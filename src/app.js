import express from 'express';
import cors from 'cors';

import dotenv from 'dotenv';
dotenv.config({
    path: "./.env"
});

const app = express();
//basic configuration
app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static('public'));
 
//cors configuration
app.use(cors({
    origin: process.env.ORIGIN || "http://localhost:3000",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
import healthCheckrouter from './routes/healthCheckrouter.js';
app.use('/api/v1/healthcheck/', healthCheckrouter);
app.get('/', (req, res) => {
    res.status(200).json({Message:"Code is live"}).send('OK');
});

export default app;