import express from 'express';
import cors from 'cors';
import { simulateScheduler } from './controllers/cpuController.js';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post('/simulate', simulateScheduler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
