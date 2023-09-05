import { App } from '@/app';
import { ValidateEnv } from '@/utils/validate-env';

ValidateEnv();

const app = new App([]);

app.listen();
