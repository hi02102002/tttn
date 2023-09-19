import { App } from '@/app';
import { ClassRoute, RoleRoute, ScoreRoute, StudentRoute, SubjectRoute } from '@/routes';
import { ValidateEnv } from '@/utils/validate-env';
import 'reflect-metadata';

ValidateEnv();

const app = new App([new SubjectRoute(), new StudentRoute(), new ClassRoute(), new ScoreRoute(), new RoleRoute()]);

app.listen();
