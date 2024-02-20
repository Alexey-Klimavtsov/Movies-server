import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Genre, GenreDocument } from './schemas/genre.schema';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

@Injectable()
export class GenreService {
    constructor(
        @InjectModel(Genre.name) private genreModel: Model<GenreDocument>,
    ) {}

    async create(createGenreDto: CreateGenreDto) {
        const createdGenre = new this.genreModel(createGenreDto);
        return createdGenre.save();
    }

    async findAll(): Promise<Genre[]> {
        return this.genreModel.find({}).exec();
    }

    async findOne(id: number | string): Promise<Genre | null> {
        return this.genreModel.findById(id).exec();
    }

    async update(
        id: number | string,
        updateGenreDto: UpdateGenreDto,
    ): Promise<Genre | null> {
        return this.genreModel
            .findByIdAndUpdate(id, updateGenreDto, { new: true })
            .exec();
    }

    async remove(id: number | string) {
        return this.genreModel.findByIdAndDelete(id).exec();
    }
}
