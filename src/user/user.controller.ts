import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Req,
    HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from '../auth/auth.service';
import { MailService } from '../mail/mail.service';
import { AuthGuard } from '@nestjs/passport/dist';
import { Request, Response } from 'express';
import { Public } from '../decorators/public.decorator';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enum/role.enum';
import { ApiTags, ApiCreatedResponse } from '@nestjs/swagger/dist';
import { User, UserDocument } from './schemas/user.schema';
import { UserDecorator } from '../decorators/user.decorator';
import { ExportFormat } from '../enum/exportFormat.enum';
import { formateData, writeToFile } from '../utilities/utilities';
import path from 'path';
import { Permissions } from 'src/enum/permissions.enum';

@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly mailService: MailService,
        private readonly authService: AuthService,
    ) {}

    @Get('me')
    me(@Req() req: Request) {
        const { user } = req;
        return user;
    }

    @Post()
    @Public()
    @ApiCreatedResponse({
        description: 'The record has been successfully created.',
        type: User,
    })
    async create(@Body() createUserDto: CreateUserDto) {
        const user = await this.userService.create(createUserDto);

        const html = await this.authService.getLink({
            email: createUserDto.email,
        });

        // TODO: Для тестироавния отправку нужно замокать
        await this.mailService.sendMessage({
            email: createUserDto.email,
            html,
            subject: 'Тема письма',
        });

        return user;
    }

    @Post('export')
    async exportData(
        @Body() { exportFormat }: { exportFormat: ExportFormat },
        @Req() response: Response,
    ) {
        const filename = 'data.txt';
        const filePath = path.join(__dirname, '../../', filename);

        const users: User[] | null = await this.userService.findAll();

        const formatedData = await formateData(exportFormat, users);
        await writeToFile(filename, formatedData);
        response.setHeader('Content-Type', 'application/octet-stream');
        response.setHeader(
            'Content-Disposition',
            `attachment; filename=${filename}`,
        );
        response.sendFile(filePath);
        return HttpStatus.CREATED;
    }

    @Get()
    @Roles(Role.Admin)
    findAll() {
        return this.userService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.userService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
        @UserDecorator() user: UserDocument,
    ) {
        this.authService.canAccessResource(user, id);
        return this.userService.update(id, updateUserDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @UserDecorator() user: UserDocument) {
        this.authService.canAccessResource(user, id);
        return this.userService.remove(id);
    }
}
