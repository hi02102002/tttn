import { App } from '@/app';
import { ClassRoute, RoleRoute, ScoreRoute, StudentRoute, SubjectRoute, UserRoute } from '@/routes';
import { ValidateEnv } from '@/utils/validate-env';
import 'reflect-metadata';
import { AuthRote } from './routes/auth.route';

ValidateEnv();

const app = new App([new SubjectRoute(), new StudentRoute(), new ClassRoute(), new ScoreRoute(), new RoleRoute(), new AuthRote(), new UserRoute()]);

app.listen();
