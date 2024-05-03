import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cats } from './entities/cats.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cats])],
  controllers: [CatsController],
  providers: [CatsService],
})

export class CatsModule {}
