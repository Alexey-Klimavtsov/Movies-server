import { Test, TestingModule } from '@nestjs/testing';
import { ProducerController } from './producer.controller';
import { ProducerService } from './producer.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Producer, ProducerSchema } from './schemas/producer.schema';

describe('ProducerController', () => {
    let controller: ProducerController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                MongooseModule.forRoot('mongodb://127.0.0.1:27017/movies'),
                MongooseModule.forFeature([
                    { name: Producer.name, schema: ProducerSchema },
                ]),
            ],
            controllers: [ProducerController],
            providers: [ProducerService],
        }).compile();

        controller = module.get<ProducerController>(ProducerController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
