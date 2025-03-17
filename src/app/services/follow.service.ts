import { Injectable } from '@angular/core';
import { Follow } from '../shared/model/follow';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root'
})
export class FollowService {
  private dbPath = '/follows';

  followsRef!: AngularFireList<Follow>;

  constructor(private db: AngularFireDatabase) {
    this.followsRef = db.list(this.dbPath);
  }

  getAll(): AngularFireList<Follow> {
    return this.followsRef;
  }

  create(follow: Follow): any {
    return this.followsRef.push(follow);
  }

  update(key: string, value: any): Promise<void> {
    return this.followsRef.update(key, value);
  }

  delete(key: string): Promise<void> {
    return this.followsRef.remove(key);
  }
}
