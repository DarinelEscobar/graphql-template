import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../user/domain/repositories/user.repository.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('UserRepository') private readonly userRepository: UserRepository,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas (no existe el usuario)');
    }

    if (user.password !== password) {
      throw new UnauthorizedException('Password incorrecto');
    }

    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const payload = { sub: user.id, rol: user.rol };
    console.log('User role from token:',user.rol);

    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
      userId: user.id,
      rol: user.rol,
    };
  }
}
