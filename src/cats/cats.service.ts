import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCatDto } from './dto/create-cat.dto';
import { Cats } from './entities/cats.entity';

@Injectable()
export class CatsService {
  /**
   * Here, we have used data mapper approch for this tutorial that is why we
   * injecting repository here. Another approch can be Active records.
   */
  constructor(
    @InjectRepository(Cats) private readonly catsRepository: Repository<Cats>,
  ) {}

  /**
   * this is function is used to create User in User Entity.
   * @param createUserDto this will type of createUserDto in which
   * we have defined what are the keys we are expecting from body
   * @returns promise of user
   */
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


  removeCat(id: number): Promise<{ affected?: number }> {
    return this.catsRepository.delete(id);
  }
}