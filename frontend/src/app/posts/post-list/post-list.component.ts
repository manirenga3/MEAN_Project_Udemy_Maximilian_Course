import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { AuthService } from 'src/app/auth/auth.service';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  totalPosts: number;
  postsPerPage: number = 2;
  currentPage: number = 1;
  pageSizeOptions: number[] = [1, 2, 5, 10];
  userId: string;
  isAuthenticated: boolean = false;
  private postsSub$: Subscription;
  private authSub$: Subscription;

  constructor(
    private postsService: PostsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.authSub$ = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.userId = this.authService.getUserId();
        this.isAuthenticated = authStatus;
      });
    this.postsService.getPostsFromServer(this.postsPerPage, this.currentPage);
    this.postsSub$ = this.postsService
      .getPostsUpdateListener()
      .subscribe((postData) => {
        this.posts = postData.posts;
        this.totalPosts = postData.totalPosts;
      });
  }

  onDeletePost(id: string) {
    this.postsService.deletePostFromServer(id).subscribe(() => {
      this.postsService.getPostsFromServer(this.postsPerPage, this.currentPage);
    });
  }

  onPageChanged(event: PageEvent) {
    this.postsPerPage = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.postsService.getPostsFromServer(this.postsPerPage, this.currentPage);
  }

  ngOnDestroy(): void {
    if (this.postsSub$) this.postsSub$.unsubscribe();
    if (this.authSub$) this.authSub$.unsubscribe();
  }
}
