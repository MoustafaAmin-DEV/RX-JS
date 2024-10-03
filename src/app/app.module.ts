import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { SearchPostComponent } from './search-post/search-post.component';
import { FormsModule } from '@angular/forms';
import { NewPostComponent } from './new-post/new-post.component';
import { PostCommentComponent } from './post-comment/post-comment.component';

@NgModule({
  declarations: [AppComponent, SearchPostComponent, NewPostComponent, PostCommentComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
