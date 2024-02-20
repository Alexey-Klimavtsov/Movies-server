import { Test, TestingModule } from '@nestjs/testing';
import { ProducerService } from './producer.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Producer, ProducerSchema } from './schemas/producer.schema';
import { getProducer } from '../../test/fixtures';

const id = '65639ea784481de1430ea3e2';

describe('ProducerService', () => {
    let service: ProducerService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                MongooseModule.forRoot('mongodb://127.0.0.1:27017/movies'),
                MongooseModule.forFeature([
                    { name: Producer.name, schema: ProducerSchema },
                ]),
            ],
            providers: [ProducerService],
        }).compile();

        service = module.get<ProducerService>(ProducerService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create a producer', async () => {
        const createProducerDto = getProducer();
        const createdProducer = await service.create(createProducerDto);
        expect(createdProducer.fullName).toEqual(createProducerDto.fullName);
    });

    it('get all producer', async () => {
        const allProducers = await service.findAll();
        expect(allProducers.length).toBeGreaterThan(0);
    });

    it('get producer by id', async () => {
        const producer = await service.findOne(id);
        expect(producer?.fullName).toEqual('Harper Miller');
    });

    it('update producer by id', async () => {
        const updateProducerDto = {
            birthDate: new Date('2010-10-10'),
        };
        const updatedProducer = await service.update(id, updateProducerDto);
        expect(updatedProducer?.birthDate).toEqual(updateProducerDto.birthDate);
    });
});
