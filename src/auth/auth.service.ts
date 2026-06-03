import {
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { USER_REPOSITORY } from '../shared/constants/injection-tokens';

import type { IUserRepository } from '../domain/repositories/user.repository.interface';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,

    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    correo: string,
    password: string,
  ) {
    const user =
      await this.userRepository.findByEmail(
        correo,
      );

    if (!user) {
      throw new UnauthorizedException(
        'Credenciales inválidas',
      );
    }

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password,
      );

    if (!passwordMatch) {
      throw new UnauthorizedException(
        'Credenciales inválidas',
      );
    }

    return user;
  }

  async login(
    correo: string,
    password: string,
  ) {
    const user = await this.validateUser(
      correo,
      password,
    );

    const payload = {
  sub: user.id,
  correo: user.correo,
  role: user.role,
  ciudad: user.ciudad,
  companiaId: user.companiaId,
};
    return {
      access_token:
        await this.jwtService.signAsync(payload),
    };
  }

async register(
  dto: RegisterDto,
) {
  const existingUser =
    await this.userRepository.findByEmail(
      dto.correo,
    );

  if (existingUser) {
    throw new UnauthorizedException(
      'El correo ya está registrado',
    );
  }

  const hashedPassword =
    await bcrypt.hash(
      dto.password,
      10,
    );

  return this.userRepository.create(
    dto.correo,
    hashedPassword,
    dto.role ?? 'USER',
    dto.ciudad,
    dto.companiaId,
  );
}
}

