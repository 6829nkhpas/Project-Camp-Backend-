import express from 'express';

import dotenv from 'dotenv';
dotenv.config({
    path: "./.env"
});

const app = express();

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});
app.get('/', (req, res) => {
    res.status(200).json({Message:"Code is live"}).send('OK');
});

export default app;