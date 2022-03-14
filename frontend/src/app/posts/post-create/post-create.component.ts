import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { PostsService } from '../posts.service';
import { Post } from '../post.model';
import { mimeType } from './mime-type.validator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit, OnDestroy {
  post: Post = {
    id: null,
    title: null,
    content: null,
    image: null,
    creator: null,
  };
  mode: string = 'create';
  form: FormGroup;
  imagePreview: string;
  private id: string = null;

  constructor(
    private postsService: PostsService,
    private authservice: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, { validators: [Validators.required] }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.mode = 'edit';
        this.id = paramMap.get('id');
        this.postsService
          .getSinglePostFromServer(this.id)
          .subscribe((resData) => {
            const userId = this.authservice.getUserId();
            if (userId !== resData.data.post.creator) {
              this.router.navigate(['/']);
            }
            this.post = resData.data.post;
            this.form.setValue({
              title: this.post.title,
              content: this.post.content,
              image: this.post.image,
            });
          });
      } else {
        this.mode = 'create';
        this.id = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    const { title, content, image } = this.form.value;
    if (this.mode === 'create') {
      this.postsService.savePostToServer(title, content, image);
    } else {
      this.postsService.updatePostInServer(this.id, title, content, image);
    }
    // this.form.reset();
  }

  ngOnDestroy(): void {}
}
