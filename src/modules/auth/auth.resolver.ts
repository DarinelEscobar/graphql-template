import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => String, { name: 'login' })
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ): Promise<string> {
    const result = await this.authService.login(email, password);
    // Retornamos el token (o puedes retornar un objeto con más info)
    return result.access_token;
  }
}
