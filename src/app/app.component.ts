import { Component, OnInit } from '@angular/core';
import { ApiService } from './shared/services/api.service';
import { Post } from './shared/interfaces/post';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'RX-JS';
  posts: Post[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getPostsBehaviorSubject().subscribe({
      next: (posts: Post[]) => {
        this.posts = posts;
        console.log('Posts:', this.posts);
      },
      error: (err) => {
        console.error('Error fetching posts:', err);
      },
    });
  }
}
