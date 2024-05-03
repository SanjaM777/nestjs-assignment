import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as validationPipeService from '@nestts/validation-pipes';

jest.mock('@nestjs/core', () => ({
    NestFactory: {
        create: jest.fn().mockImplementation(() => ({
            useGlobalPipes: jest.fn(),
            listen: jest.fn(),
        }))
    }
}));
jest.mock('@nestts/validation-pipes');

describe('bootstrap', () => {
    it('should create app, initialize validation pipes and listen on a port', async () => {
        const { bootstrap } = require('./main');
        await bootstrap();

        expect(NestFactory.create).toBeCalledWith(AppModule);
        expect(validationPipeService).toBeCalled();

        const mockApp = await NestFactory.create(AppModule);
    });
});