import { ApiProperty } from '@nestjs/swagger';

import {
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({
    example: 'OpenAI',
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 100, {
    message:
      'El nombre debe tener entre 3 y 100 caracteres',
  })
  nombre!: string;

  @ApiProperty({
    example: 'Bogotá',
  })
  @IsString()
  @IsNotEmpty()
  direccion!: string;

  @ApiProperty({
    example: '3001234567',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+$/, {
    message:
      'El teléfono solo debe contener números',
  })
  @Length(7, 15, {
    message:
      'El teléfono debe tener entre 7 y 15 dígitos',
  })
  telefono!: string;
}