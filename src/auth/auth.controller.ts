import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-user.dto'
import { LoginDto } from './dto/LoginDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

 @Post('register')
 singUp(@Body() createAuthDto: CreateAuthDto){
  return this.authService.singUp(createAuthDto);
 }

 @Post('login')
 login(@Body() loginDto: LoginDto){
  return this.authService.login(loginDto);
 }
}
