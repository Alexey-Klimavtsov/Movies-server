import { Module } from '@nestjs/common';
import { GenreService } from './genre.service';
import { GenreController } from './genre.controller';
import { Genre, GenreSchema } from './schemas/genre.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Genre.name, schema: GenreSchema }]),
    ],
    controllers: [GenreController],
    providers: [GenreService],
})
export class GenreModule {}
