import { Service } from 'typedi';

@Service()
export class AuthService {
  login(email: any, password: any): { user: any; token: any } | PromiseLike<{ user: any; token: any }> {
    throw new Error('Method not implemented.');
  }
}
