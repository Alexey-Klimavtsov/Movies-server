import { Controller, Post, Body, NotFoundException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { CreateLinkAuthDto } from './dto/createLink-auth.dto';
import { ApiTags } from '@nestjs/swagger';
import { MailService } from '../mail/mail.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly mailService: MailService,
    ) {}

    @Post()
    async login(@Body() createAuthDto: CreateAuthDto) {
        return this.authService.login(createAuthDto);
    }

    @Post('link')
    async sendLinkbyEmail(@Body() createLinkAuthDto: CreateLinkAuthDto) {
        try {
            const html = await this.authService.getLink(createLinkAuthDto);
            await this.mailService.sendMessage({
                email: createLinkAuthDto.email,
                html,
                subject: 'Тема письма',
            });
        } catch (error) {
            throw error;
        }
    }
}
