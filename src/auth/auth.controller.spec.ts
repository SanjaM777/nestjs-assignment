import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { CreateAuthDto } from './dto/create-user.dto';
import { LoginDto } from './dto/LoginDto';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockResolvedValue(true),
}));

const mockAuthRepository = {
  findOneBy: jest.fn(),
  save: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('signedToken'),
};

describe('AuthController', () => {
  let controller: AuthController;
  let authRepository: Repository<Auth>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(Auth),
          useValue: mockAuthRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authRepository = module.get<Repository<Auth>>(getRepositoryToken(Auth));
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signUp', () => {
    it('should create a new user and return the user data', async () => {
      const createAuthDto = new CreateAuthDto();
      createAuthDto.username = 'testuser';
      createAuthDto.email = 'test@example.com';
      createAuthDto.password = 'password123';
      createAuthDto.role = 'user';

      mockAuthRepository.findOneBy.mockResolvedValue(null);
      mockAuthRepository.save.mockResolvedValue(createAuthDto);

      const result = await controller.signUp(createAuthDto);

      expect(authRepository.save).toHaveBeenCalledWith({
        email: createAuthDto.email,
        username: createAuthDto.username,
        role: createAuthDto.role,
        password: 'hashedPassword',
      });
      expect(result).toEqual(createAuthDto); 
    });
  });

  describe('login', () => {
    it('should allow a user to login', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const user = new Auth();
      user.id = 1;
      user.email = loginDto.email;
      user.password = 'password123';

      mockAuthRepository.findOneBy.mockResolvedValue(user);

      const result = await controller.login(loginDto);

      expect(mockJwtService.sign).toHaveBeenCalledWith({ id: user.id });
      expect(result).toEqual({ token: 'signedToken' });
    });
  });
});