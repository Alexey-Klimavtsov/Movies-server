import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
} from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Roles } from '../decorators/roles.decorator';
import { Role } from 'src/enum/role.enum';
import { isValidateDate } from '../utilities/utilities';

export type Filter = {
    startDate: string;
    endDate: string;
};

@Controller('report')
export class ReportController {
    constructor(private readonly reportService: ReportService) {}

    @Post()
    @Roles(Role.Admin)
    async create() {
        const createReportDto: CreateReportDto =
            await this.reportService.getStatisticData();
        return this.reportService.create(createReportDto);
    }

    @Get()
    findAll(@Query() filter: Filter) {
        const startDate = isValidateDate(filter.startDate)
            ? new Date(filter.startDate)
            : null;
        const endDate = isValidateDate(filter.endDate)
            ? new Date(filter.endDate)
            : new Date();

        return this.reportService.findAll(startDate, endDate);
    }
}
