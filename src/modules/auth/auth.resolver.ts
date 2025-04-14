import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthPayload } from './types/auth-payload.type';
import { LoginInput } from './dto/login.input';
import { CreateAccountInput } from './dto/create-account.input';
// import { Throttle } from '@nestjs/throttler';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}



  @Mutation(() => AuthPayload, { name: 'login' })
  async login(@Args('data') data: LoginInput): Promise<AuthPayload> {
    return this.authService.login(data.email, data.password);
  }

  @Mutation(() => AuthPayload, { name: 'createAccount' })
  async createAccount(@Args('data') data: CreateAccountInput): Promise<AuthPayload> {
    return this.authService.createAccount(data.name, data.email, data.password);
  }

  @Mutation(() => AuthPayload, { name: 'refreshToken' })
  async refreshToken(@Args('refreshToken') refreshToken: string): Promise<AuthPayload> {
    return this.authService.refreshToken(refreshToken);
  }
}
