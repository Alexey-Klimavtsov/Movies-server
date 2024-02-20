import { Module } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { ProducerController } from './producer.controller';
import { Producer, ProducerSchema } from './schemas/producer.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Producer.name, schema: ProducerSchema },
        ]),
    ],
    controllers: [ProducerController],
    providers: [ProducerService],
})
export class ProducerModule {}
