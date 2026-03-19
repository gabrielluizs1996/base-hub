import express from 'express';
import ordersRoutes from './routes/orders.route';
import serverless from 'serverless-http';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', ordersRoutes);

if (process.env.NODE_ENV !== 'production') {
  app.listen(3001);
}

export default serverless(app);