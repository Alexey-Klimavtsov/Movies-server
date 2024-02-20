import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Req,
    Res,
    HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { MovieService } from './movie.service';
import { PlaylistService } from '../playlist/playlist.service';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Public } from '../decorators/public.decorator';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enum/role.enum';
import { AccessGuard } from '../auth/guards/acsses.guard';
import { UserDocument } from '../user/schemas/user.schema';
import { ApiTags } from '@nestjs/swagger/dist';
import { UserDecorator } from '../decorators/user.decorator';
// experiment
import { Movie } from './schemas/movie.schema';
import mongoose, { Model } from 'mongoose';

import { AuthService } from '../auth/auth.service';
import { Permissions } from '../enum/permissions.enum';
import { ExportFormat } from '../enum/exportFormat.enum';
import { formateData, writeToFile } from '../utilities/utilities';
import * as path from 'path';

@ApiTags('Movie')
@Controller('movie')
export class MovieController {
    private session: any;
    constructor(
        @InjectConnection() private connection: mongoose.Connection,
        private readonly authService: AuthService,
        private readonly movieService: MovieService,
        private readonly playlistService: PlaylistService,
    ) {
        this.initializeSession();
    }

    async initializeSession() {
        try {
            this.session = await this.connection.startSession();
        } catch (error) {
            console.error('Error initializing session:', error);
        }
    }

    @Post()
    async create(
        @Body() createMovieDto: CreateMovieDto,
        @UserDecorator() user: UserDocument,
    ) {
        this.authService.can(user, Permissions.MANAGE_REVIEWS);
        this.movieService.clearCache();
        return this.movieService.create(createMovieDto);
    }

    @Post('export')
    async exportData(
        @Body() { exportFormat }: { exportFormat: ExportFormat },
        @UserDecorator() user: UserDocument,
        @Res() response: Response,
    ) {
        const filename = 'data.txt';
        const filePath = path.join(__dirname, '../../', filename);
        const movies: Movie[] | null = await this.movieService.findAll(user);
        const formatedData = await formateData(exportFormat, movies);
        await writeToFile(filename, formatedData);

        response.setHeader('Content-Type', 'application/octet-stream');
        response.setHeader(
            'Content-Disposition',
            `attachment; filename=${filename}`,
        );
        response.sendFile(filePath);
        return HttpStatus.CREATED;
    }

    @Get()
    @Public()
    @UseGuards(AccessGuard)
    async findAll(@Req() req: Request & { user: UserDocument }) {
        const user = req.user;
        return this.movieService.findAll(user);
    }

    @Get(':id')
    @Public()
    @UseGuards(AccessGuard)
    async findOne(
        @Param('id') id: string,
        @Req() req: Request & { user: UserDocument },
    ) {
        const user = req.user;
        return this.movieService.findOne(id, user);
    }

    @Patch(':id')
    @Roles(Role.Admin)
    async update(
        @Param('id') id: string,
        @Body() updateMovieDto: UpdateMovieDto,
    ) {
        this.movieService.clearCache();
        return this.movieService.update(id, updateMovieDto);
    }

    @Delete(':id')
    @Roles(Role.User)
    async remove(@Param('id') id: string) {
        this.movieService.clearCache();
        this.session.startTransaction();

        try {
            await this.playlistService.removeMovieIdFromPlaylist(
                id,
                this.session,
            );
            await this.movieService.remove(id, this.session);
            await this.session.commitTransaction();
            return HttpStatus.OK;
        } catch (error) {
            await this.session.abortTransaction();
            throw error;
        }
    }
}
