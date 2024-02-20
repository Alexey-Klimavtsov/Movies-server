import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PlaylistService } from './playlist.service';
import { PlaylistController } from './playlist.controller';
import { Playlist, PlaylistSchema } from './schemas/playlist.schema';
import { UserModule } from '../user/user.module';
import { User, UserSchema } from 'src/user/schemas/user.schema';
import { UserService } from '../user/user.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Playlist.name, schema: PlaylistSchema },
        ]),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ],
    controllers: [PlaylistController],
    providers: [PlaylistService, UserService],
    exports: [PlaylistService],
})
export class PlaylistModule {}
