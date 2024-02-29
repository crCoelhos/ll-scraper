// Seu arquivo principal
import cors from 'cors';
import express from 'express';
import routes from './routes/index.js';

import dotenv from 'dotenv';
dotenv.config();


const app = express();

app.use(express.json());
app.use(cors());
app.use(routes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
