import { Component } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { Post } from '../shared/interfaces/post';

@Component({
  selector: 'app-search-post',
  templateUrl: './search-post.component.html',
  styleUrls: ['./search-post.component.scss'],
})
export class SearchPostComponent {
  searchTerm: string = '';
  posts: Post[] = [];

  constructor(private apiService: ApiService) {}

  search(): void {
    this.apiService.searchPosts(this.searchTerm);
    this.apiService.getPostsSubject().subscribe({
      next: (filteredPosts: Post[]) => {
        this.posts = filteredPosts;
        console.log('Filtered Posts:', this.posts);
      },
      error: (err) => {
        console.error('Error fetching filtered posts:', err);
      },
    });
  }
}
