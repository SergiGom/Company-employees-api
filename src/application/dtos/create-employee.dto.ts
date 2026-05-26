import { ApiProperty } from '@nestjs/swagger';

import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateEmployeeDto {
  @ApiProperty({
    example: 'Sergio',
  })
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @ApiProperty({
    example: 'Gomez',
  })
  @IsString()
  @IsNotEmpty()
  apellido!: string;

  @ApiProperty({
    example: 'sergio@test.com',
  })
  @IsEmail()
  correo!: string;

  @ApiProperty({
    example: 'Backend Developer',
  })
  @IsString()
  cargo!: string;

  @ApiProperty({
    example: 5000,
  })
  @IsNumber()
  salario!: number;

  @ApiProperty({
    example: 1,
  })
  @IsNumber()
  companiaId!: number;
}