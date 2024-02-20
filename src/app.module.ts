import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MovieModule } from './movie/movie.module';
import { MongooseModule } from '@nestjs/mongoose';
import { GenreModule } from './genre/genre.module';
import { ProducerModule } from './producer/producer.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { JwtGuard } from './auth/guards/jwt.guard';
import { PlaylistModule } from './playlist/playlist.module';
import { RolesGuard } from './auth/guards/roles.guard';
import { ReportModule } from './report/report.module';
import { MailModule } from './mail/mail.module';

const globalGuard = {
    provide: APP_GUARD,
    useClass: JwtGuard,
};

const rolesGuard = {
    provide: APP_GUARD,
    useClass: RolesGuard,
};

@Module({
    imports: [
        MovieModule,
        MongooseModule.forRoot('mongodb://127.0.0.1:27017/movies'),
        GenreModule,
        ProducerModule,
        UserModule,
        AuthModule,
        PlaylistModule,
        ReportModule,
        MailModule,
    ],
    controllers: [AppController],
    providers: [AppService, globalGuard, rolesGuard],
})
export class AppModule {}
