import {
    IsAlphanumeric,
    IsEmail,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsString,
    Matches,
    MinLength,
  } from 'class-validator';
  
//   const passwordRegEx =
//     /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,20}$/;
  
  export class CreateUserDto {
  
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
