import {
    Injectable,
    UnauthorizedException,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAuthDto } from './dto/create-auth.dto';
import { User, UserDocument } from '../user/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { UserService } from '../user/user.service';
import { Permissions } from '../enum/permissions.enum';
import { RolePermissions } from '../enum/rolePermissions.enum';
import { CreateLinkAuthDto } from './dto/createLink-auth.dto';
import { ERROR_MESSAGE } from '../utilities/constants';
import { CreateTokenAuthDto } from './dto/createToken-auth.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwtService: JwtService,
        private configService: ConfigService,
        private userService: UserService,
    ) {}

    async login(createAuthDto: CreateAuthDto): Promise<string> {
        const user: UserDocument | null = await this.userModel.findOne({
            email: createAuthDto.email,
        });
        if (!user) throw new NotFoundException(ERROR_MESSAGE.USER_NOT_FOUND);
        if (user.password !== createAuthDto.password) {
            throw new UnauthorizedException(ERROR_MESSAGE.INCORRECT_PASSWORD);
        }
        return `${user.email} ${user.password}`;
    }

    async isAuth(token: string = ''): Promise<boolean> {
        if (!token.trim())
            throw new UnauthorizedException(ERROR_MESSAGE.ACCESS_DENIDE);
        const [email, password] = token.split(' ');
        const user = await this.userModel.findOne({ email, password });
        if (!user) throw new NotFoundException(ERROR_MESSAGE.ACCESS_DENIDE);
        return true;
    }

    generateToken({ email, _id, roles }: CreateTokenAuthDto) {
        const secret = this.configService.get('JWT_SALT');
        return this.jwtService.sign({ email, _id, roles }, { secret });
    }

    async getLink(createLinkAuthDto: CreateLinkAuthDto) {
        const user: UserDocument | null = await this.userService.findByEmail(
            createLinkAuthDto.email,
        );

        if (!user) throw new NotFoundException(ERROR_MESSAGE.USER_NOT_FOUND);
        const clientUrl = this.configService.get('CLIENT_URL');
        const token = this.generateToken({
            email: user.email,
            roles: user.roles,
            _id: user._id.toString(),
        });
        const link = `${clientUrl}/auth/${token}`;
        const html = `<p><a href="${link}">Войти в аккаунт</a></p>`;
        return html;
    }

    can(user: UserDocument, permission: Permissions) {
        const result = user.roles.some((role) =>
            RolePermissions[role].includes(permission),
        );
        if (!result)
            throw new ForbiddenException(ERROR_MESSAGE.NOT_HAVE_PERMISSIONS);
        return result;
    }

    canAccessResource(user: UserDocument, id: string) {
        const userId = user._id.toString();
        if (id !== userId) {
            this.can(user, Permissions.MANAGE_REVIEWS);
        }
        return true;
    }
}
