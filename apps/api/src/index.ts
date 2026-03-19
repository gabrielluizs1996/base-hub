import express from 'express';
import ordersRoutes from './routes/orders.route';
import serverless from 'serverless-http';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', ordersRoutes);


const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});


export default serverless(app);