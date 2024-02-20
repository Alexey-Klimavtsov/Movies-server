import { ApiProperty } from '@nestjs/swagger';

export class CreateProducerDto {
    @ApiProperty()
    fullName: string;
    @ApiProperty()
    birthDate: Date;
}
