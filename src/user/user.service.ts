import {
    Injectable,
    UnauthorizedException,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async create(createUserDto: CreateUserDto) {
        const createdUser = new this.userModel({ ...createUserDto });
        return createdUser.save();
    }

    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    async findOne(id: number | string): Promise<User | null> {
        return this.userModel.findById(id);
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email });
    }

    async update(
        id: number | string,
        updateUserDto: UpdateUserDto,
    ): Promise<User | null> {
        return this.userModel.findByIdAndUpdate(id, updateUserDto, {
            new: true,
        });
    }

    async remove(id: number | string) {
        return this.userModel.findByIdAndDelete(id);
    }

    async addPlaylistToUserPlaylists(userId: string, playlistId: string) {
        await this.userModel.findOneAndUpdate(
            { _id: userId },
            { $push: { playlists: playlistId } },
        );
    }

    async removePlaylistFromUserPlaylists(userId: string, playlistId: string) {
        await this.userModel.findOneAndUpdate(
            { _id: userId },
            { $pull: { playlists: playlistId } },
        );
    }
}
