import {
    IsAlphanumeric,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsString,
    MinLength,
  } from 'class-validator';
  
  export class CreateAuthDto {
  
    @IsNotEmpty()
    @MinLength(3, { message: 'Username must have atleast 3 characters.' })
    @IsAlphanumeric()
    username: string;
  
    @IsNotEmpty()
    @IsEmail()
    email: string;
  
    @IsString()
    @IsEnum(['admin', 'user'])
    role: string;
  
    @IsNotEmpty()
    @MinLength(8)
    password: string;
  }
