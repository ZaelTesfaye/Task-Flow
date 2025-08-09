const dotenv = require('dotenv');
dotenv.config();
import type {Request, Response, NextFunction} from 'express';
const express = require('express');
const taskRoutes = require('./routes/task.routes');
const userRoutes = require('./routes/user.routes');
const config = require('./config/config');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());

app.use('/tasks', taskRoutes);
app.use('/users', userRoutes);

app.get('/home', (req: Request, res: Response) => {
  console.log('Serving /home page');
  res.render('index', { title: 'Task Manager', message: 'Welcome to the Task Manager Application!' });
});

app.use((req: Request, res: Response) => {
  res.status(404).send('Not Found!');
});

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  res.status(500).send('An error occurred');
});

const server = app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

const exitHandler = (serverInstance: ReturnType<typeof app.listen> | undefined) => {
  if (serverInstance) {
    serverInstance.close(() => {
      console.log('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

process.on('uncaughtException', (error) => {
  console.error(error);
  exitHandler(server);
});

process.on('unhandledRejection', (error) => {
  console.error(error);
  exitHandler(server);
});