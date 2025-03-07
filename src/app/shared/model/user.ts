import { AngularFireAuth } from "@angular/fire/compat/auth";

export class CustomUser {
    uid!: string;
    username!: string;
    email!: string;
    // picture_url!: string;

    constructor(auth: any) {
        this.uid = auth.uid;
    }
} 