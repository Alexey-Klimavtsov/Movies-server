/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger/dist/decorators';

export type ReportDocument = HydratedDocument<Report>;

@Schema()
export class Report {
    @ApiProperty()
    @Prop()
    moviesCount: number;

    @ApiProperty()
    @Prop({ unique: false })
    playlistsCount: number;

    @ApiProperty()
    @Prop()
    usersCount: number;

    @ApiProperty()
    @Prop({ default: Date.now })
    createdAt: Date;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
