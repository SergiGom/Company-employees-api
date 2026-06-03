import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';

import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';

import { AuthService } from './auth.service';

import { JwtStrategy } from './strategies/jwt.strategy';

import { PrismaService } from '../infrastructure/prisma/prisma.service';

import { UserRepository } from '../infrastructure/repositories/user.repository';

import { USER_REPOSITORY } from '../shared/constants/injection-tokens';

@Module({
  imports: [
    PassportModule,

    JwtModule.register({
  secret:
    process.env.JWT_SECRET,

      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],

  controllers: [AuthController],

  providers: [
    PrismaService,

    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },

    AuthService,

    JwtStrategy,
  ],

  exports: [AuthService],
})
export class AuthModule {}

