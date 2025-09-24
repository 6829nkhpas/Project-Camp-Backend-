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
    origin: process.env.origin?.split(",") || "http://localhost:3000",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
//health check endpoint
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});
app.get('/', (req, res) => {
    res.status(200).json({Message:"Code is live"}).send('OK');
});

export default app;