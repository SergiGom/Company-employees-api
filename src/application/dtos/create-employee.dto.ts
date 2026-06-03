import { ApiProperty } from '@nestjs/swagger';

import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
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
  @IsNotEmpty()
  cargo!: string;

  @ApiProperty({
    example: 5000,
  })
  @IsNumber()
  @IsPositive()
  salario!: number;

  @ApiProperty({
    example: 1,
  })
  @IsInt()
  @IsPositive()
  companiaId!: number;
}

