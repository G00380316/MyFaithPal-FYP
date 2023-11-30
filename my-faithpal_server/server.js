import express from 'express';
import bodyParser from 'body-parser';

//Routes
import bibleRoutes from './routes/bible.js';

const app = express();
const PORT = 5000;

app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Welcome to Faithpals Backend Servers'));

app.use('/bibles', bibleRoutes);

app.listen(PORT, () => console.log(`Server started on port http://localhost:${PORT}`));