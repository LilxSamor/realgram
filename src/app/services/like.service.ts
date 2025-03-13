import { Injectable } from '@angular/core';
import { Like } from '../shared/model/like';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  private dbPath = '/likes';

  likesRef!: AngularFireList<Like>;

  constructor(private db: AngularFireDatabase) {
    this.likesRef = db.list(this.dbPath);
  }

  getAll(): AngularFireList<Like> {
    return this.likesRef;
  }

  create(like: Like): any {
    return this.likesRef.push(like);
  }

  update(key: string, value: any): Promise<void> {
    return this.likesRef.update(key, value);
  }

  delete(key: string): Promise<void> {
    return this.likesRef.remove(key);
  }
}
