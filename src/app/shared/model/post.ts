import { CustomUser } from "./user";

export class Post {
    id!: number;
    username!: string;
    type!: Type;
    url!: string;
    news_title: string = '';
    news_source: string = '';
    news_published_at: string = '';
    weather_icon: string = '';
    description?: string;
    pollOptions: PollOption[] = [];
    usersWhoVoted: string[] = [];
}

export enum Type {
    Text = 'TEXT', 
    Audio = 'AUDIO', 
    Video = 'VIDEO', 
    Photo = 'PHOTO', 
    Poll = 'POLL'
}

export class PollOption {
    votes: number = 0;
    optionText!: string;
}