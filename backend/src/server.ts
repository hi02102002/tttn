import { App } from '@/app';
import { ClassRoute, StudentRoute, SubjectRoute } from '@/routes';
import { ValidateEnv } from '@/utils/validate-env';
import 'reflect-metadata';

ValidateEnv();

const app = new App([new SubjectRoute(), new StudentRoute(), new ClassRoute()]);

app.listen();
