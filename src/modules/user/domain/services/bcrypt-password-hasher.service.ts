import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcryptjs'
import { PasswordHasher } from './password-hasher.interface'

@Injectable()
export class BcryptPasswordHasherService implements PasswordHasher {
  async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
  }

  async compare(password: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(password, hashed)
  }
}