import { Test, TestingModule } from '@nestjs/testing';
import { GenreService } from './genre.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Genre, GenreSchema } from './schemas/genre.schema';
import { getGenre } from '../../test/fixtures';

const id = '65639ea7d258dfefc9972a01';

describe('GenreService', () => {
    let service: GenreService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                MongooseModule.forRoot('mongodb://127.0.0.1:27017/movies'),
                MongooseModule.forFeature([
                    { name: Genre.name, schema: GenreSchema },
                ]),
            ],
            providers: [GenreService],
        }).compile();

        service = module.get<GenreService>(GenreService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create a genre', async () => {
        const createGenreDto = getGenre();
        const createdGenre = await service.create(createGenreDto);
        console.log(createdGenre);
        expect(createdGenre.title).toEqual(createGenreDto.title);
    });

    it('get all genres', async () => {
        const allGenres = await service.findAll();
        expect(allGenres.length).toBeGreaterThan(0);
    });

    it('get genre by id', async () => {
        const genre = await service.findOne(id);
        expect(genre?.title).toEqual('Приключения');
    });

    it('update genre by id', async () => {
        const updateGenreDto = {
            title: 'Приключения',
        };
        const updatedGenre = await service.update(id, updateGenreDto);
        expect(updatedGenre?.title).toEqual(updateGenreDto.title);
    });
});
