/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { Genre } from '../../genre/schemas/genre.schema';
import { Producer } from '../../producer/schemas/producer.schema';

export type MovieDocument = HydratedDocument<Movie>;

@Schema()
export class Movie {
    @Prop()
    title: string;

    @Prop()
    description: string;

    @Prop()
    year: number;

    @Prop()
    length: number;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Producer' }] })
    producer: Producer[];

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Genre' }] })
    genre: Genre[];
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
