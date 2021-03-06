import 'dotenv/config';
import express from 'express';
import { connectDB } from './database.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import UserRoutes from './routes/user/index.js';
import helmet from 'helmet';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';

const app = express();
app.use(cookieParser());
app.use(helmet());
app.use(hpp());
app.use(cors({ credentials: true, origin: true }));
app.use(bodyParser.json());

app.use('/user', UserRoutes);

const port: Number = Number(process.env.SERVER_PORT) || 3001;
const startServer = async () => {
  await app.listen(port, () => {
    console.log(`
Server running on http://localhost:${port}
`);
  });
};

(async () => {
  await connectDB();
  await startServer();
})();
