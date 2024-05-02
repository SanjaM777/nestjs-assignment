import { Body, Controller, Get, Param, Post,Delete, UseGuards} from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { ParseIntPipe } from '../common/pipes/parse-int.pipe';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { Cat } from './interfaces/cat.interface';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@UseGuards(RolesGuard)
@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}


  @Post()
  @Roles(['admin'])
  create(@Body() createCatsDto: CreateCatDto) {
    return this.catsService.createCat(createCatsDto);
  }

  @Get()
  findAll() {
    return this.catsService.findAllCats();
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.catsService.findById(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.catsService.removeCat(+id);
  }
}