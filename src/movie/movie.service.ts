import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Movie, MovieDocument } from './schemas/movie.schema';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { UserDocument } from '../user/schemas/user.schema';
import * as NodeCache from 'node-cache';

const cacheKey = {
    allMovies: 'allMovies',
};
@Injectable()
export class MovieService {
    private movieCache;
    constructor(
        @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
    ) {
        this.movieCache = new NodeCache({ stdTTL: 540 });
    }

    async create(createMovieDto: CreateMovieDto): Promise<Movie> {
        const createdMovie = new this.movieModel(createMovieDto);
        return createdMovie.save();
    }

    async findAll(user?: UserDocument): Promise<Movie[]> {
        let allMovies;
        if (this.movieCache.has(cacheKey.allMovies)) {
            allMovies = this.movieCache.get(cacheKey.allMovies) as Movie[];
        } else {
            allMovies = await this.movieModel.find().exec();
            this.movieCache.set(cacheKey.allMovies, allMovies);
        }
        if (user) return allMovies;
        return allMovies.map((movie) => {
            return { title: movie.title } as Movie;
        });
    }

    async findOne(id: string, user?: UserDocument): Promise<Movie | null> {
        if (user) {
            return this.movieModel.findById(id).exec();
        }
        return this.movieModel.findById(id).select('title').exec();
    }

    async update(
        id: string,
        updateMovieDto: UpdateMovieDto,
    ): Promise<Movie | null> {
        return this.movieModel.findOneAndUpdate({ _id: id }, updateMovieDto, {
            new: true,
        });
    }

    async remove(
        id: string | number,
        session: mongoose.mongo.ClientSession,
    ): Promise<Movie | null> {
        return this.movieModel.findByIdAndDelete(id, { session });
    }

    async clearCache() {
        this.movieCache.del(cacheKey.allMovies);
    }

    async clearDatabase() {
        await this.movieModel.deleteMany({});
    }
}
