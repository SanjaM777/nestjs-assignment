import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from './entities/auth.entity';
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from './dto/create-user.dto';
import { LoginDto } from './dto/LoginDto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private usersRepository: Repository<Auth>,
    private jwtService: JwtService,
  ) { }

  async signUp(createAuthDto: CreateAuthDto) {
    const username = createAuthDto.username;
    const invalidUser = await this.usersRepository.findOneBy({ username })
    if (invalidUser) {
      throw new ForbiddenException('Username already taken.');
    }

    const user: Auth = new Auth();
    const hashedPassword = await bcrypt.hash(createAuthDto.password, 10)
    user.email = createAuthDto.email;
    user.username = createAuthDto.username;
    user.role = createAuthDto.role;
    user.password = hashedPassword;

    return this.usersRepository.save(user);
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      throw new UnauthorizedException('Email does not exist.');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      throw new UnauthorizedException('The password you’ve entered is incorrect.');
    }

    const token = this.jwtService.sign({ id: user.id })
    return { token };
  }
}

