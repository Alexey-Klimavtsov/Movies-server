import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { User, UserSchema } from '../user/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config/dist';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport/dist';
import { JwtService } from '@nestjs/jwt/dist';
import { MailService } from '../mail/mail.service';

@Module({
    imports: [
        UserModule,
        ConfigModule.forRoot(),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        PassportModule,
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        UserService,
        JwtStrategy,
        JwtService,
        ConfigService,
        MailService,
    ],
})
export class AuthModule {}
