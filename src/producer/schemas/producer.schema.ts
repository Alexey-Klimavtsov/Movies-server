import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProducerDocument = HydratedDocument<Producer>;

@Schema()
export class Producer {
    @Prop()
    fullName: string;

    @Prop()
    birthDate: Date;
}
export const ProducerSchema = SchemaFactory.createForClass(Producer);
