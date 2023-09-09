import { Router } from 'express';

export interface Routes {
  path: string;
  router: Router;
  controller: unknown;
  initializeRoutes: () => void;
}
