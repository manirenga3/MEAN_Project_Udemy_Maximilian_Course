import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { appConstant } from '../constants/app.constants';
import { Post } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; totalPosts: number }>();

  constructor(
    private http: HttpClient,
    private toast: HotToastService,
    private router: Router
  ) {}

  getPostsUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  savePostToServer(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http
      .post<{ status: string; message: string; data: { post: Post } }>(
        `${environment.rootUrl}${appConstant.POST_API}`,
        postData
      )
      .pipe(
        this.toast.observe({
          loading: 'Saving post...',
          success: (res) => `${res.message}`,
          error: (err) => `${err}`,
        })
      )
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }

  getPostsFromServer(postsPerPage: number, page: number) {
    const queryParams = `?postsPerPage=${postsPerPage}&page=${page}`;
    this.http
      .get<{
        status: string;
        message: string;
        data: { posts: Post[]; totalPosts: number };
      }>(`${environment.rootUrl}${appConstant.POST_API}${queryParams}`)
      .pipe(
        this.toast.observe({
          // loading: 'Fetching post...',
          // success: (res) => `${res.message}`,
          error: (err) => `${err}`,
        })
      )
      .subscribe((resData) => {
        this.posts = resData.data.posts;
        const { totalPosts } = resData.data;
        this.postsUpdated.next({ posts: [...this.posts], totalPosts });
      });
  }

  getSinglePostFromServer(id: string) {
    return this.http.get<{
      status: string;
      message: string;
      data: { post: Post };
    }>(`${environment.rootUrl}${appConstant.POST_API}/${id}`);
  }

  updatePostInServer(
    id: string,
    title: string,
    content: string,
    image: File | string
  ) {
    let postData: FormData | Post | any;
    if (typeof image === 'string') {
      postData = { title, content, image };
    } else {
      postData = new FormData();
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    }
    this.http
      .patch<{
        status: string;
        message: string;
        data: null;
      }>(`${environment.rootUrl}${appConstant.POST_API}/${id}`, postData)
      .pipe(
        this.toast.observe({
          loading: 'Updating post...',
          success: (res) => `${res.message}`,
          error: (err) => `${err}`,
        })
      )
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }

  deletePostFromServer(id: string) {
    return this.http
      .delete<{
        status: string;
        message: string;
        data: null;
      }>(`${environment.rootUrl}${appConstant.POST_API}/${id}`)
      .pipe(
        this.toast.observe({
          loading: 'Deleting post...',
          success: (res) => `${res.message}`,
          error: (err) => `${err}`,
        })
      );
  }
}
