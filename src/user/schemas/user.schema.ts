/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { ApiProperty } from '@nestjs/swagger/dist/decorators';

import { Playlist } from '../../playlist/schemas/playlist.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    @ApiProperty()
    @Prop()
    username: string;
    @ApiProperty()
    @Prop({ required: true, unique: true })
    email: string;
    @ApiProperty()
    @Prop({ default: ['user'] })
    roles: string[];

    @Prop({ required: true })
    password: string;
    @ApiProperty()
    @Prop()
    token: string;
    @ApiProperty()
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' }] })
    playlists: Playlist[];
}

export const UserSchema = SchemaFactory.createForClass(User);
