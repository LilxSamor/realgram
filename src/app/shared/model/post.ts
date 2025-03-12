export class Post {
    key?: string | null;
    id!: number;
    username!: string;
    type!: Type;
    url!: string;
    description?: string;
}

export enum Type {
    Text = 'TEXT', 
    Audio = 'AUDIO', 
    Video = 'VIDEO', 
    Photo = 'PHOTO', 
    Poll = 'POLL'
}