import { CustomUser } from "./user";

export class Post {
    id!: number;
    username!: string;
    type!: Type;
    url!: string;
    news_title: string = '';
    news_source: string = '';
    news_published_at: string = '';
    is_news: boolean = false;
    weather_icon: string = '';
    description?: string;
    pollOptions: PollOption[] = [];
    usersWhoVoted: string[] = [];
    likes: number = 0;
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