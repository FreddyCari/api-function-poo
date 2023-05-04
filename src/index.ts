import 'reflect-metadata';
import { EnvironmentVariable } from './config/environment';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { AuthStrategies } from './modules/auth/strategies';
import { errorMiddleware } from './middleware';
import { userRoutes, productRoutes, tenantRoutes } from './routers';
import { userMenuRoutes } from './routers/user-menu.routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
AuthStrategies;
app.use(morgan('dev'));
app.use(
  cors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  })
);

app.use('/api/v1', [tenantRoutes, userRoutes, productRoutes, userMenuRoutes]);

app.use(errorMiddleware);

app.listen(EnvironmentVariable.APP_PORT, () =>
  console.log(
    `Listen in PORT = ${EnvironmentVariable.APP_PORT} :: ENV = ${EnvironmentVariable.APP_ENV}`
  )
);
