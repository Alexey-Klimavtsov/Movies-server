import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({
        description: 'User name or nik',
        minimum: 3,
        default: 'unnamed',
    })
    username: string;
    @ApiProperty()
    email: string;
    @ApiProperty()
    password: string;
}
