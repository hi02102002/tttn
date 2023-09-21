import { CREDENTIALS, LOG_FORMAT, NODE_ENV, ORIGIN, PORT } from '@/configs';
import { ErrorMiddleware, dbLogger, subjectSoftDelete } from '@/middlewares';
import { Routes } from '@interfaces/routes.interface';
import { logger, stream } from '@utils/logger';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import Container from 'typedi';
import { RolesService } from './services/roles.service';

export class App {
  public app: express.Application;
  public env: string;
  public port: string | number;
  public roleService = Container.get(RolesService);

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;

    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
    this.roleService.seedRoles();
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(morgan(LOG_FORMAT, { stream }));
    this.app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    dbLogger();
    subjectSoftDelete();
  }

  private initializeRoutes(routes: Routes[]) {
    this.app.get('/', (req, res) => {
      res.send('Hello World!');
    });
    routes.forEach(route => {
      this.app.use('/', route.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(ErrorMiddleware);
  }
}
