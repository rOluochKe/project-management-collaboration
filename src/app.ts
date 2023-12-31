import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';

import swaggerApp from './middleware/swagger';

import projectRoutes from './routes/projectRoutes';
import taskRoutes from './routes/taskRoutes';
import userRoutes from './routes/userRoutes';
import teamRoutes from './routes/teamRoutes';

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use('/', swaggerApp);
app.use(cors());

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/teams', teamRoutes);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

export default app;
