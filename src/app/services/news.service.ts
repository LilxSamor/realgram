import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { catchError, from, map, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  // private apiKey: string = '0441bd2be9658481fb6abe1bce4fbc38';
  private apiUrl: string = 'https://dk57mywfzc.execute-api.us-east-1.amazonaws.com/prod/news';

  private newsPath: string = 'news/cachedNews';
  private cachedNewsPosts!: AngularFireList<any>;

  constructor(private http: HttpClient, private db: AngularFireDatabase) {
    //this.cachedNewsPosts = db.list(this.newsPath);
  }

  getLatestNews() {
    return this.http.get<any>(this.apiUrl);
  }

  /*
  getNews(): Observable<any[]> {
    return this.cachedNewsPosts.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({
          key: c.payload.key,
          ...c.payload.val(),
        }))
      ),
      map(articles => articles.slice(0, 3) // Limit to 3 articles
      )
    );
  }*/

  /*
  private getLastFetchDate() {
    const lastFetch = localStorage.getItem(this.lastFetchDateKey);
    return lastFetch ? new Date(lastFetch) : new Date(0);
  }

  private hasDayPassed(): boolean {
    const lastFetchDate = this.getLastFetchDate();
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
    return (now.getTime() - lastFetchDate.getTime()) > oneDay;
  }
  
  create(newsEntry: any): Promise<void> {
    return this.cachedNewsRef.push(newsEntry).then(() => {
      localStorage.setItem(this.lastFetchDateKey, new Date().toString()); // Update localStorage
    });
  }

  getNews(): Observable<any> {
    let params = new HttpParams()
    .set('access_key', this.apiKey)
    .set('countries', 'ch')
    .set('languages', 'de');

    return this.http.get<any>(this.baseUrl, { params }).pipe(
      switchMap(newsData => {
        const newsEntry = {
          data: newsData,
          fetchedAt: new Date().toString(),
        };
        console.log(newsEntry);
        console.log(newsData);

        return from(this.create(newsEntry)).pipe(
          // Use map to return the newsData after creating the entry
          map(() => newsData),
        );
      }),
      catchError(error => {
        console.error('Error fetching news:', error);
        return of(null);
      })
    );

    // return this.http.get<any>(this.baseUrl, {params});
  }

  private getCachedNews(): AngularFireList<any> {
    return this.cachedNewsRef;
  }*/
}
