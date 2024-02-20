import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { Playlist } from '../../playlist/schemas/playlist.schema';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    playlists?: string[];
}
