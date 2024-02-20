import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Movie, MovieSchema } from './schemas/movie.schema';
import { User, UserSchema } from '../user/schemas/user.schema';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt/dist';
import { ConfigService } from '@nestjs/config/dist';
import { UserService } from '../user/user.service';
import { PlaylistService } from '../playlist/playlist.service';
import { PlaylistModule } from '../playlist/playlist.module';
import { Playlist, PlaylistSchema } from '../playlist/schemas/playlist.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        MongooseModule.forFeature([
            { name: Playlist.name, schema: PlaylistSchema },
        ]),
    ],
    controllers: [MovieController],
    providers: [
        MovieService,
        AuthService,
        JwtService,
        ConfigService,
        UserService,
        PlaylistService,
    ],
})
export class MovieModule {}
