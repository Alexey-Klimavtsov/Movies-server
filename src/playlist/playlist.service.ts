import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { Playlist, PlaylistDocument } from './schemas/playlist.schema';
import { User, UserDocument } from '../user/schemas/user.schema';

@Injectable()
export class PlaylistService {
    constructor(
        @InjectModel(Playlist.name)
        private playlistModel: Model<PlaylistDocument>,
    ) {}
    async create(createPlaylistDto: CreatePlaylistDto) {
        const createdPlaylist = new this.playlistModel(createPlaylistDto);
        return createdPlaylist.save();
    }

    async findAll(user?: UserDocument): Promise<Playlist[]> {
        if (user) {
            return this.playlistModel
                .find({
                    $or: [{ isPublic: true }, { createdByUser: user._id }],
                })
                .exec();
        }
        return this.playlistModel.find({ isPublic: true }).exec();
    }

    async findOne(id: string, user?: UserDocument): Promise<Playlist | null> {
        if (user) {
            return this.playlistModel
                .findOne({
                    $or: [
                        { _id: id, createdByUser: user._id },
                        { _id: id, isPublic: true },
                    ],
                })
                .exec();
        }
        return this.playlistModel.findOne({ _id: id, isPublic: true }).exec();
    }

    async update(
        id: string,
        updatePlaylistDto: UpdatePlaylistDto,
        user: UserDocument,
    ): Promise<Playlist | null> {
        return this.playlistModel.findOneAndUpdate(
            { _id: id, createdByUser: user._id },
            updatePlaylistDto,
        );
    }

    async removeMovieIdFromPlaylist(
        movieIdtoRemove: string,
        session: mongoose.mongo.ClientSession,
    ) {
        return await this.playlistModel.updateMany(
            { movies: movieIdtoRemove },
            { $pull: { movies: movieIdtoRemove } },
            { session, new: true },
        );
    }

    async remove(id: string, user: UserDocument): Promise<Playlist | null> {
        return this.playlistModel.findOneAndDelete({
            _id: id,
            createdByUser: user._id,
        });
    }

    async incrementEntriesCount(playlistId: string, increment: number) {
        this.playlistModel
            .findByIdAndUpdate(playlistId, {
                $inc: { entriesСount: increment },
            })
            .exec();
    }
}
