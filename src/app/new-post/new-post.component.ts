import { Component } from '@angular/core';
import { Post } from '../shared/interfaces/post';
import { ApiService } from '../shared/services/api.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.scss'],
})
export class NewPostComponent {
  newPost: Post = { id: 0, title: '', body: '' };

  constructor(private apiService: ApiService) {}

  addPost(): void {
    this.apiService.sendPost(this.newPost).subscribe({
      next: (response) => {
        console.log('Post added:', response);

        // الحصول على القيمة الحالية للـ BehaviorSubject
        const currentPosts = this.apiService
          .getPostsBehaviorSubjectValue()
          .getValue();

        // تحديث الـ BehaviorSubject بالقيمة الجديدة
        this.apiService
          .getPostsBehaviorSubjectValue()
          .next([...currentPosts, response]);
      },
      error: (err) => {
        console.error('Error adding post:', err);
      },
    });
  }
}
