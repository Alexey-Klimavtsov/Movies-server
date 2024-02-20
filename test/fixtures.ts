import { Genre } from '../src/genre/schemas/genre.schema';
import { Producer } from '../src/producer/schemas/producer.schema';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

const firstNames: string[] = [
    'Emma',
    'Liam',
    'Olivia',
    'Noah',
    'Ava',
    'Isabella',
    'Sophia',
    'Jackson',
    'Mia',
    'Lucas',
    'Harper',
    'Ethan',
    'Aiden',
    'Amelia',
    'Abigail',
];

const secondNames: Array<string> = [
    'Smith',
    'Johnson',
    'Williams',
    'Brown',
    'Jones',
    'Miller',
    'Davis',
    'García',
    'Rodriguez',
    'Martinez',
    'Hernandez',
    'Lopez',
    'Gonzalez',
    'Wilson',
    'Anderson',
];

const movieGenres: Array<string> = [
    'Action',
    'Comedy',
    'Drama',
    'Horror',
    'Science Fiction',
    'Romance',
    'Thriller',
    'Adventure',
    'Fantasy',
    'Mystery',
    'Crime',
    'Animation',
    'Family',
    'Documentary',
    'Musical',
];

export function getGenre(): Genre {
    const index = getIndex(movieGenres);
    return { title: movieGenres[index] };
}

export function getProducer(): Producer {
    let index = getIndex(firstNames);
    const firstName = firstNames[index];
    index = getIndex(secondNames);
    const secondName = secondNames[index];
    const birthDate = new Date(
        getRandomInt(1960, 1990),
        getRandomInt(0, 11),
        getRandomInt(1, 28),
    );
    const fullName = `${firstName} ${secondName}`;

    return { fullName, birthDate };
}

export function getUser(): CreateUserDto {
    const username =
        secondNames[getIndex(secondNames)] + firstNames[getIndex(firstNames)];
    const email = 'user' + getRandomInt(100, 999) + '@mail.ru';
    const password = 'ab' + getRandomInt(100, 999);
    return { username, email, password };
}

function getIndex(arr: Array<string | number>): number {
    return getRandomInt(0, arr.length - 1);
}

function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
