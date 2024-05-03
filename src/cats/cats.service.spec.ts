import { Test, TestingModule } from '@nestjs/testing';
import { CatsService } from './cats.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cats } from './entities/cats.entity';
import { CreateCatDto } from './dto/create-cat.dto';
import { ForbiddenException } from '@nestjs/common';

const mockCatsRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOneBy: jest.fn(),
  find: jest.fn(),
  delete: jest.fn(),
};

describe('CatsService', () => {
  let service: CatsService;
  let repository: Repository<Cats>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatsService,
        {
          provide: getRepositoryToken(Cats),
          useValue: mockCatsRepository,
        },
      ],
    }).compile();

    service = module.get<CatsService>(CatsService);
    repository = module.get<Repository<Cats>>(getRepositoryToken(Cats));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('createCat', () => {
    const createCatDto: CreateCatDto = { name: 'New Cat', age: 1, breed: 'Siamese' };

    it('should successfully create a cat', async () => {
      mockCatsRepository.findOneBy.mockResolvedValue(null);
      mockCatsRepository.save.mockResolvedValue(createCatDto);

      const result = await service.createCat(createCatDto);

      expect(result).toEqual(createCatDto);
      expect(mockCatsRepository.save).toHaveBeenCalledWith(createCatDto);
    });

    it('should throw a ForbiddenException if the cat name already exists', async () => {
      mockCatsRepository.findOneBy.mockResolvedValue(createCatDto);

      await expect(service.createCat(createCatDto)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findAllCats', () => {
    it('should return an array of cats', async () => {
      const catArray = [new Cats(), new Cats()];
      mockCatsRepository.find.mockResolvedValue(catArray);

      const result = await service.findAllCats();

      expect(result).toEqual(catArray);
    });
  });

  describe('findById', () => {
    it('should get a single cat', async () => {
      const cat = new Cats();
      mockCatsRepository.findOneBy.mockResolvedValue(cat);
      const result = await service.findById(1);

      expect(result).toEqual(cat);
      expect(mockCatsRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('updateCat', () => {
    it('should update a cat', async () => {
      const updatedCatDto: CreateCatDto = { name: 'Updated Cat', age: 2, breed: 'Persian' };

      mockCatsRepository.save.mockResolvedValue(updatedCatDto);
      const result = await service.updateCat(1, updatedCatDto);

      expect(result).toEqual(updatedCatDto);
      expect(mockCatsRepository.save).toHaveBeenCalledWith({ ...updatedCatDto, id: 1 });
    });
  });

  describe('removeCat', () => {
    it('should remove a cat', async () => {
      mockCatsRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.removeCat(1);

      expect(result).toEqual({ affected: 1 });
      expect(mockCatsRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should handle errors when removing a cat', async () => {
      const errorMessage = "Error removing cat.";
      mockCatsRepository.delete.mockRejectedValue(new Error(errorMessage));

      await expect(service.removeCat(1)).rejects.toThrow(errorMessage);
    });
  });
});