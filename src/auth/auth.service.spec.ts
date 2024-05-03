import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { Auth } from './entities/auth.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateAuthDto } from './dto/create-user.dto';
import { LoginDto } from './dto/LoginDto';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let jwtStrategy : JwtStrategy;
  let service: AuthService;
  let jwtService: JwtService;
  let usersRepository: Repository<Auth>;

  beforeEach(async () => {
    const usersRepositoryMock = {
      findOneBy: jest.fn(),
      save: jest.fn(),
    };

    const jwtServiceMock = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(Auth),
          useValue: usersRepositoryMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersRepository = module.get<Repository<Auth>>(getRepositoryToken(Auth));
    jwtService = module.get<JwtService>(JwtService);

    (usersRepository.findOneBy as jest.Mock).mockReset();
    (usersRepository.save as jest.Mock).mockReset();
    (jwtService.sign as jest.Mock).mockReset();
    (bcrypt.hash as jest.Mock).mockReset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    it('should create a new user', async () => {
      const createAuthDto: CreateAuthDto = {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
        role: 'user',
      };
      bcrypt.hash = jest.fn().mockResolvedValue('hashedPassword');
      (usersRepository.save as jest.Mock).mockReturnValue(Promise.resolve(createAuthDto));

      const result = await service.signUp(createAuthDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(createAuthDto.password, 10);

      (usersRepository.findOneBy as jest.Mock).mockResolvedValueOnce(new Auth());
      await expect(service.signUp(createAuthDto)).rejects.toThrow(ForbiddenException);

      expect(usersRepository.save).toHaveBeenCalledWith({
        ...createAuthDto,
        password: 'hashedPassword',
      });
      expect(result).toEqual(createAuthDto);
    });
  });

  describe('login', () => {
    it('should return a token for valid credentials', async () => {
      const loginDto: LoginDto = { email: 'test@example.com', password: 'password123' };
      const foundUser = {
        email: loginDto.email,
        password: await bcrypt.hash(loginDto.password, 10),
      };
      bcrypt.compare = jest.fn().mockResolvedValue(true);
      (usersRepository.findOneBy as jest.Mock).mockResolvedValue(foundUser);
      (jwtService.sign as jest.Mock).mockReturnValue('signed-jwt-token');

      const result = await service.login(loginDto);

      (usersRepository.findOneBy as jest.Mock).mockResolvedValueOnce(null);
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);

      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, foundUser.password);
      expect(usersRepository.findOneBy).toHaveBeenCalledWith({ email: loginDto.email });

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);

      expect(jwtService.sign).toHaveBeenCalledWith(expect.any(Object));
      expect(result).toHaveProperty('token', 'signed-jwt-token');
    });
  });

});