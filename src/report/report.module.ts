import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Report, ReportSchema } from './schemas/report.schema';
import { User, UserSchema } from '../user/schemas/user.schema';
import { Playlist, PlaylistSchema } from '../playlist/schemas/playlist.schema';
import { Movie, MovieSchema } from '../movie/schemas/movie.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Report.name, schema: ReportSchema },
        ]),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MongooseModule.forFeature([
            { name: Playlist.name, schema: PlaylistSchema },
        ]),
        MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
    ],
    controllers: [ReportController],
    providers: [ReportService],
})
export class ReportModule {}
