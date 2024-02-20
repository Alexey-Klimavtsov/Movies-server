/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { Movie } from '../../movie/schemas/movie.schema';
import { User } from '../../user/schemas/user.schema';

export type PlaylistDocument = HydratedDocument<Playlist>;

@Schema()
export class Playlist {
    @ApiProperty()
    @Prop()
    title: string;

    @ApiProperty()
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }] })
    movies: Movie[];

    @ApiProperty()
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    createdByUser: User;

    @ApiProperty()
    @Prop({ default: false })
    isPublic: boolean;

    @ApiProperty()
    @Prop({ default: 1 })
    entriesСount: number;
}

export const PlaylistSchema = SchemaFactory.createForClass(Playlist);

PlaylistSchema.index({ movies: 1 }, { unique: true });
