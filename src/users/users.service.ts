import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    ){}

  getAllUsers() : Promise<User[]> {
    const users = this.usersRepository.find();
    return users;
  }

  getUserthById(id : number) : Promise<User>{
    const user =  this.usersRepository.findOneBy({id});
      if(user){
        return user;
      }
      throw new NotFoundException('Could not find the user');
  }

  createUser(createUserDto: CreateUserDto): Promise<User> {
  
    const user: User = new User();
    user.email = createUserDto.email;
    user.username = createUserDto.username;
    user.password = createUserDto.password;
    user.role = createUserDto.role;
    return this.usersRepository.save(user);
  }

  removeUser(id: number): Promise<{ affected?: number }> {
    return this.usersRepository.delete(id);
  }
}

