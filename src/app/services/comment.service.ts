import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { UserComment } from '../shared/model/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private dbPath = '/comments';

  commentsRef!: AngularFireList<UserComment>;

  constructor(private db: AngularFireDatabase) {
    this.commentsRef = db.list(this.dbPath);
  }

  getAll(): AngularFireList<UserComment> {
    return this.commentsRef;
  }

  create(comment: UserComment): any {
    return this.commentsRef.push(comment);
  }

  update(key: string, value: any): Promise<void> {
    return this.commentsRef.update(key, value);
  }

  delete(key: string): Promise<void> {
    return this.commentsRef.remove(key);
  }

  deleteAll(): Promise<void> {
    return this.commentsRef.remove();
  }
}
