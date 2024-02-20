import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { GenreService } from './genre.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enum/role.enum';
import { Public } from 'src/decorators/public.decorator';
import { ApiTags } from '@nestjs/swagger/dist';
import { HttpStatus } from '@nestjs/common';

@ApiTags('Genre')
@Controller('genre')
export class GenreController {
    constructor(private readonly genreService: GenreService) {}

    @Post()
    @Roles(Role.Admin)
    async create(@Body() createGenreDto: CreateGenreDto) {
        return this.genreService.create(createGenreDto);
    }

    @Get()
    @Public()
    async findAll() {
        return this.genreService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.genreService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.Admin)
    async update(
        @Param('id') id: string,
        @Body() updateGenreDto: UpdateGenreDto,
    ) {
        return this.genreService.update(id, updateGenreDto);
    }

    @Delete(':id')
    @Roles(Role.Admin)
    async remove(@Param('id') id: string) {
        return this.genreService.remove(id);
    }
}
