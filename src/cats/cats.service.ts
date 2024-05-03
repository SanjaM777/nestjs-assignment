import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCatDto } from './dto/create-cat.dto';
import { Cats } from './entities/cats.entity';

@Injectable()
export class CatsService {
 
  constructor(
    @InjectRepository(Cats) private readonly catsRepository: Repository<Cats>,
  ) {}

  async createCat(createCatsDto: CreateCatDto): Promise<Cats> {
    const name = createCatsDto.name
    const invalidName =await this.catsRepository.findOneBy({name})  
    
    if(invalidName){
      throw new ForbiddenException('invalid name')
    }
    const cat: Cats = new Cats();
    cat.name = createCatsDto.name;
    cat.age = createCatsDto.age;
    cat.breed = createCatsDto.breed;
    return this.catsRepository.save(cat);
  }


  findAllCats(): Promise<Cats[]> {
    return this.catsRepository.find();
  }

  findById(id: number): Promise<Cats> {
    return this.catsRepository.findOneBy({ id });
  }

  updateCat(id: number, createCatsDto: CreateCatDto): Promise<Cats> {
    const cat: Cats = new Cats();
    cat.name = createCatsDto.name;
    cat.age = createCatsDto.age;
    cat.breed = createCatsDto.breed;
    cat.id = id;
    return this.catsRepository.save(cat);
  } 

  removeCat(id: number): Promise<{ affected?: number }> {
    return this.catsRepository.delete(id);
  }
}