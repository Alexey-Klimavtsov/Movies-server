import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Producer, ProducerDocument } from './schemas/producer.schema';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';

@Injectable()
export class ProducerService {
    constructor(
        @InjectModel(Producer.name)
        private producerModel: Model<ProducerDocument>,
    ) {}

    async create(createProducerDto: CreateProducerDto) {
        const createdProducer = new this.producerModel(createProducerDto);
        return createdProducer.save();
    }

    async findAll(): Promise<Producer[]> {
        return this.producerModel.find();
    }

    async findOne(id: number | string): Promise<Producer | null> {
        return this.producerModel.findById(id);
    }

    async update(
        id: number | string,
        updateProducerDto: UpdateProducerDto,
    ): Promise<Producer | null> {
        return this.producerModel.findByIdAndUpdate(id, updateProducerDto, {
            new: true,
        });
    }

    async remove(id: number | string) {
        return this.producerModel.findByIdAndDelete(id);
    }
}
