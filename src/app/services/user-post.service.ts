import { Injectable } from '@angular/core';
import { Post } from '../shared/model/post';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root'
})
export class UserPostService {
  private dbPath = '/posts';

  userPostsRef!: AngularFireList<Post>;

  constructor(private db: AngularFireDatabase) {
    this.userPostsRef = db.list(this.dbPath);
  }

  vote(id: number, optionIndex: number) {
    
  }

  getAll(): AngularFireList<Post> {
    return this.userPostsRef;
  }

  create(post: Post): any {
    return this.userPostsRef.push(post);
  }

  update(key: string, value: any): Promise<void> {
    return this.userPostsRef.update(key, value);
  }

  delete(key: string): Promise<void> {
    return this.userPostsRef.remove(key);
  }

  deleteAll(): Promise<void> {
    return this.userPostsRef.remove();
  }
}
