import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { ProducerService } from './producer.service';
import { CreateProducerDto } from './dto/create-producer.dto';
import { UpdateProducerDto } from './dto/update-producer.dto';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enum/role.enum';
import { ApiTags } from '@nestjs/swagger/dist';

@ApiTags('Producer')
@Controller('producer')
export class ProducerController {
    constructor(private readonly producerService: ProducerService) {}

    @Post()
    @Roles(Role.Admin)
    async create(@Body() createProducerDto: CreateProducerDto) {
        return this.producerService.create(createProducerDto);
    }

    @Get()
    async findAll() {
        return this.producerService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.producerService.findOne(id);
    }

    @Patch(':id')
    @Roles(Role.Admin)
    async update(
        @Param('id') id: string,
        @Body() updateProducerDto: UpdateProducerDto,
    ) {
        return this.producerService.update(id, updateProducerDto);
    }

    @Delete(':id')
    @Roles(Role.Admin)
    async remove(@Param('id') id: string) {
        return this.producerService.remove(id);
    }
}
