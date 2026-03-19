import serverless from 'serverless-http';
import app from '../apps/api/src';

export default serverless(app);