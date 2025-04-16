import { AngularFireAuth } from "@angular/fire/compat/auth";

export class CustomUser {
    uid!: string;
    username!: string;
    email!: string;
    description: string = '';
    picture_url?: string;
    followers?: number = 0;
    following?: number = 0;

    constructor(auth: any) {
        this.uid = auth.uid;
    }
} 