import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { getUser } from '../../test/fixtures';

describe('UserService', () => {
    let service: UserService;
    let id: string;
    let testUser: User;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                MongooseModule.forRoot('mongodb://127.0.0.1:27017/movies'),
                MongooseModule.forFeature([
                    { name: User.name, schema: UserSchema },
                ]),
            ],
            providers: [UserService],
        }).compile();

        service = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create a user', async () => {
        const createUserDto = getUser();
        const createdUser = await service.create(createUserDto);
        id = createdUser._id.toString();
        testUser = createdUser;
        expect(createdUser.email).toEqual(createUserDto.email);
    });

    it('get all user', async () => {
        const allUserers = await service.findAll();
        expect(allUserers.length).toBeGreaterThan(0);
    });

    it('get user by id', async () => {
        const user = await service.findOne(id);
        expect(user?.username).toEqual(testUser.username);
    });

    it('test login', async () => {
        const token = await service.login(testUser);
        expect(token).toEqual(`${testUser.email} ${testUser.password}`);
    });

    it('update user by id', async () => {
        const updateUserDto = {
            email: 'first@gmail.com',
        };
        const updatedUser = await service.update(id, updateUserDto);
        expect(updatedUser?.email).toEqual(updateUserDto.email);
    });

    it('delete user by id', async () => {
        const deletedUser = await service.remove(id);
        expect(deletedUser?.username).toEqual(testUser.username);
    });
});
