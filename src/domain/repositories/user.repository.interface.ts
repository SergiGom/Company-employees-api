    import { UserEntity } from '../entities/user.entity';

export interface IUserRepository {
  findByEmail(
    correo: string,
  ): Promise<UserEntity | null>;

 create(
  correo: string,
  password: string,
  role: string,
  ciudad?: string,
  companiaId?: number,
): Promise<UserEntity>;
}

