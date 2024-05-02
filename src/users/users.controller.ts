import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly authService: UsersService) {}

  @Post()
//   @UseGuards(AuthGuard('jwt'))
  async createUser(@Body() createAuthDto: CreateUserDto) {
   const newUser =  this.authService.createUser(createAuthDto);
   return newUser
  }

  @Get()
 async getAllAuth(): Promise<User[]>{
  const users = await this.authService.getAllUsers();
  return users;
 }

  @Get(':id')
  async getUserthById(@Param('id') id: number): Promise<User> {
    const user = await this.authService.getUserthById(Number(id));
    return user;
  }


  @Delete(':id')
  async removeUser(@Param('id') id: number) {
    const user = this.authService.removeUser(Number(id));
    return user;
  }
}
