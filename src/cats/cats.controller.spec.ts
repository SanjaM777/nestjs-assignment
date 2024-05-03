import { Test, TestingModule } from '@nestjs/testing';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';

const mockCatsService = {
    createCat: jest.fn(),
    findAllCats: jest.fn(),
    findById: jest.fn(),
    updateCat: jest.fn(),
    removeCat: jest.fn(),
};

describe('CatsController', () => {
    let controller: CatsController;
    let service: CatsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CatsController],
            providers: [{ provide: CatsService, useValue: mockCatsService }],
        }).compile();

        controller = module.get<CatsController>(CatsController);
        service = module.get<CatsService>(CatsService);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should call createCat method', async () => {
            const catDto: CreateCatDto = { name: 'Test Cat', age: 2, breed: 'Siamese' };
            await controller.create(catDto);
            expect(service.createCat).toHaveBeenCalledWith(catDto);
        });
    });

    describe('findAll', () => {
        it('should call findAllCats method', async () => {
            await controller.findAll();
            expect(service.findAllCats).toHaveBeenCalled();
        });
    });

    describe('findOne', () => {
        it('should call findById method', async () => {
            const catId = '1';
            await controller.findOne(catId);
            expect(service.findById).toHaveBeenCalledWith(+catId);
        });
    });

    describe('update', () => {
        it('should call updateCat method', async () => {
            const catId = '1';
            const catDto: CreateCatDto = { name: 'Updated Name', age: 3, breed: 'Persian' };
            await controller.update(catId, catDto);
            expect(service.updateCat).toHaveBeenCalledWith(+catId, catDto);
        });
    });

    describe('remove', () => {
        it('should call removeCat method', async () => {
            const catId = '1';
            await controller.remove(catId);
            expect(service.removeCat).toHaveBeenCalledWith(+catId);
        });
    });
});