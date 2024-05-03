import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UnauthorizedException } from '@nestjs/common';
import { Auth } from './entities/auth.entity';

process.env.JWT_SECRET = 'test_secret';

import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
    let jwtStrategy: JwtStrategy;
    let mockUsersRepository;

    beforeEach(async () => {
        mockUsersRepository = {
            findOneBy: jest.fn(),
        };

        const module = await Test.createTestingModule({
            providers: [
                JwtStrategy,
                {
                    provide: getRepositoryToken(Auth),
                    useValue: mockUsersRepository,
                },
            ],
        }).compile();

        jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    });

    it('should validate and return the user based on JWT payload', async () => {
        const userId = 1;
        const user = new Auth(); 
        user.id = userId;
        mockUsersRepository.findOneBy.mockResolvedValue(user);

        expect(await jwtStrategy.validate({ id: userId })).toEqual(user);
    });

    it('should throw an UnauthorizedException if user cannot be found', async () => {
        mockUsersRepository.findOneBy.mockResolvedValue(null);

        await expect(jwtStrategy.validate({ id: 1 })).rejects.toThrow(UnauthorizedException);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(() => {
        delete process.env.JWT_SECRET;
    });
});