export class UserEntity {
  id!: number;

  correo!: string;

  password!: string;

  role!: string;

  ciudad!: string | null;

  companiaId!: number | null;

  createdAt!: Date;
}