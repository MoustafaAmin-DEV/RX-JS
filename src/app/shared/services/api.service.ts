import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  forkJoin,
  map,
  Observable,
  retry,
  Subject,
  switchMap,
  throwError,
} from 'rxjs';
import { Post } from '../interfaces/post';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'https://jsonplaceholder.typicode.com';
  private postsSubject = new Subject<Post[]>();
  private postsBehaviorSubject = new BehaviorSubject<Post[]>([]);

  constructor(private http: HttpClient) {}
  getPosts(): void {
    this.http
      .get<Post[]>(`${this.apiUrl}/posts`)
      .pipe(
        retry(3),
        debounceTime(300),
        switchMap((data: Post[]) => {
          return data.length > 0
            ? [data]
            : throwError(() => new Error('No posts found'));
        }),
        filter((posts: Post[]) => posts.length > 0),
        map((data: Post[]) =>
          data.map((post: Post) => ({
            ...post,
            title: post.title.toUpperCase(),
          }))
        ),
        catchError((error) => {
          console.error('Error occurred:', error);
          return throwError(() => new Error('Error occurred'));
        })
      )
      .subscribe((posts) => {
        this.postsSubject.next(posts);
        this.postsBehaviorSubject.next(posts);
      });
  }
  searchPosts(term: string): void {
    this.postsBehaviorSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter((posts: Post[]) => posts.length > 0),
        map((posts: Post[]) =>
          posts.filter((post) => post.title.includes(term))
        )
      )
      .subscribe((filteredPosts) => {
        this.postsSubject.next(filteredPosts);
      });
  }

  getPostsAndComments(): Observable<any> {
    const postsRequest = this.http
      .get<Post[]>(`${this.apiUrl}/posts`)
      .pipe(retry(3), catchError(this.handleError));

    const commentsRequest = this.http
      .get<Comment[]>(`${this.apiUrl}/comments`)
      .pipe(retry(3), catchError(this.handleError));

    return forkJoin([postsRequest, commentsRequest]).pipe(
      map(([posts, comments]) => ({
        posts,
        comments,
      })),
      catchError((error) => {
        console.error(
          'Error occurred while fetching posts and comments:',
          error
        );
        return throwError(() => new Error('error'));
      })
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('Error occurred:', error);
    return throwError(() => new Error('error'));
  }

  getPostsSubject(): Observable<Post[]> {
    return this.postsSubject.asObservable();
  }

  getPostsBehaviorSubject(): Observable<Post[]> {
    return this.postsBehaviorSubject.asObservable();
  }

  getPostsBehaviorSubjectValue(): BehaviorSubject<Post[]> {
    return this.postsBehaviorSubject;
  }
  sendPost(newPost: Post): Observable<Post> {
    return this.http.post<Post>(`${this.apiUrl}/posts`, newPost).pipe(
      catchError((error) => {
        console.error('Error occurred while sending post:', error);
        return throwError(() => new Error('Error occurred while sending post'));
      })
    );
  }
}
