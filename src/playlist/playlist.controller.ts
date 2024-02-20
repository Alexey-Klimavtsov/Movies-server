import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Req,
    UseGuards,
    NotFoundException,
    HttpStatus,
} from '@nestjs/common';
import { PlaylistService } from './playlist.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { Public } from '../decorators/public.decorator';
import { Request } from 'express';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger/dist';
import { User, UserDocument } from '../user/schemas/user.schema';
import { AccessGuard } from '../auth/guards/acsses.guard';
import { UserDecorator } from '../decorators/user.decorator';
import { UserService } from '../user/user.service';
import { ERROR_MESSAGE } from '../utilities/constants';

@ApiTags('Playlist')
@ApiBearerAuth()
@Controller('playlist')
export class PlaylistController {
    constructor(
        private readonly playlistService: PlaylistService,
        private readonly userService: UserService,
    ) {}

    @Post()
    async create(
        @Body() createPlaylistDto: CreatePlaylistDto,
        @UserDecorator() user: UserDocument,
    ) {
        return this.playlistService.create({
            ...createPlaylistDto,
            createdByUser: user._id.toString(),
        });
    }

    @Get()
    @Public()
    @UseGuards(AccessGuard)
    async findAll(@Req() req: Request & { user: UserDocument }) {
        const user = req.user;
        return this.playlistService.findAll(user);
    }

    @Get(':id')
    @Public()
    @UseGuards(AccessGuard)
    async findOne(
        @Param('id') id: string,
        @Req() req: Request & { user: UserDocument },
    ) {
        const user = req.user;
        const playlist = await this.playlistService.findOne(id, user);
        return playlist ?? ERROR_MESSAGE.ACCESS_DENIDE;
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updatePlaylistDto: UpdatePlaylistDto,
        @Req() req: Request & { user: UserDocument },
    ) {
        const user = req.user;
        return this.playlistService.update(id, updatePlaylistDto, user);
    }

    @Patch(':id/copy')
    async copyPlaylistIdToUserList(
        @Param('id') playlistId: string,
        @UserDecorator() user: UserDocument,
    ) {
        const userId = user._id.toString();

        await this.userService.addPlaylistToUserPlaylists(userId, playlistId);

        await this.playlistService.incrementEntriesCount(playlistId, 1);

        return HttpStatus.OK;
    }

    @Patch(':id/remove')
    async removePlaylistIdFromUserList(
        @Param('id') playlistId: string,
        @UserDecorator() user: UserDocument,
    ) {
        const userId = user._id.toString();

        await this.userService.removePlaylistFromUserPlaylists(
            userId,
            playlistId,
        );

        await this.playlistService.incrementEntriesCount(playlistId, -1);

        return HttpStatus.OK;
    }

    @Delete(':id')
    @UseGuards(AccessGuard)
    remove(
        @Param('id') id: string,
        @Req() req: Request & { user: UserDocument },
    ) {
        const user = req.user;
        return this.playlistService.remove(id, user);
    }
}
