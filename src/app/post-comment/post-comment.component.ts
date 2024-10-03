import { Component } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { Post } from '../shared/interfaces/post';
import { Comment } from '../shared/interfaces/comment';

@Component({
  selector: 'app-post-comment',
  templateUrl: './post-comment.component.html',
  styleUrls: ['./post-comment.component.scss'],
})
export class PostCommentComponent {
  posts: Post[] = [];
  comments: Comment[] = [];
  errorMessage: string | null = null;

  constructor(private dataService: ApiService) {}

  ngOnInit(): void {
    this.dataService.getPostsAndComments().subscribe({
      next: (data) => {
        this.posts = data.posts;
        this.comments = data.comments;
      },
      error: (error) => {
        this.errorMessage = error.message;
      },
    });
  }
}
