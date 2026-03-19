import express from 'express';
import ordersRoutes from './routes/orders.route';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', ordersRoutes);

app.listen(3001, () => {
  console.log('API running on http://localhost:3001');
});