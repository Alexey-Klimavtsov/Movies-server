import { Test, TestingModule } from '@nestjs/testing';
import { MovieService } from './movie.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Movie, MovieSchema } from './schemas/movie.schema';

const id = '656281cb87cb1cf9d932c585';

describe('MovieService', () => {
    let service: MovieService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                MongooseModule.forRoot('mongodb://127.0.0.1:27017/movies'),
                MongooseModule.forFeature([
                    { name: Movie.name, schema: MovieSchema },
                ]),
            ],
            providers: [MovieService],
        }).compile();

        service = module.get<MovieService>(MovieService);
    });

    // afterAll(async () => {
    //     await service.clearDatabase();
    // });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create a movie', async () => {
        const createMovieDto = {
            title: 'Example movie',
            description: 'this is nestJS experimental',
            year: 2023,
            length: 240,
            producer: '65639ea784481de1430ea3e2',
            genre: [
                '65639920cf841d8c90742900',
                '65639ea7d258dfefc9972a01',
                '6563d629c510a52546fc88a8',
            ],
        };
        const createdMovie = await service.create(createMovieDto);
        expect(createdMovie.title).toEqual(createMovieDto.title);
    });

    it('get all movies', async () => {
        const allMovies = await service.findAll();
        expect(allMovies.length).toBeGreaterThan(0);
    });

    it('get movie by id', async () => {
        const movie = await service.findOne(id);
        expect(movie?.title).toEqual('Example movie');
    });

    it('update movie by id', async () => {
        const updateMovieDto = {
            year: 2000,
        };
        const updatedMovie = await service.update(id, updateMovieDto);
        expect(updatedMovie?.year).toEqual(updateMovieDto.year);
    });
});
