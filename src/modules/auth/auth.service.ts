import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../user/domain/repositories/user.repository.interface';
import { PasswordHasher } from '../user/domain/services/password-hasher.interface';
import { AuthPayload } from './types/auth-payload.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    @Inject('PasswordHasher') private readonly passwordHasher: PasswordHasher
  ) {}

  private async createAccessToken(payload: any): Promise<string> {
    return this.jwtService.signAsync(payload, { expiresIn: '1d' });
  }

  private async createRefreshToken(payload: any): Promise<string> {
    return this.jwtService.signAsync(payload, { expiresIn: '7d' });
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');
    const isMatch = await this.passwordHasher.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Password incorrecto');
    return user;
  }

  async login(email: string, password: string): Promise<AuthPayload> {
    const user = await this.validateUser(email, password);
    const payload = { sub: user.id, rol: user.rol };
    const accessToken = await this.createAccessToken(payload);
    const refreshToken = await this.createRefreshToken(payload);
    return { accessToken, userId: user.id, rol: user.rol, refreshToken };
  }

  async createAccount(name: string, email: string, password: string): Promise<AuthPayload> {
    const hashed = await this.passwordHasher.hash(password);
    // Enforce backend-controlled role: defaulting to USER
    const user = await this.userRepository.create({ name, email, password: hashed, rol: 'USER' });
    const payload = { sub: user.id, rol: user.rol };
    const accessToken = await this.createAccessToken(payload);
    const refreshToken = await this.createRefreshToken(payload);
    return { accessToken, userId: user.id, rol: user.rol, refreshToken };
  }

  async refreshToken(token: string): Promise<AuthPayload> {
    try {
      const payload = await this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET });
      const newPayload = { sub: payload.sub, rol: payload.rol };
      const newAccessToken = await this.createAccessToken(newPayload);
      const newRefreshToken = await this.createRefreshToken(newPayload);
      return { accessToken: newAccessToken, userId: payload.sub, rol: payload.rol, refreshToken: newRefreshToken };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
