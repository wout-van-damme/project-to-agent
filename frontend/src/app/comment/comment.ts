import { Component, inject, input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AsyncPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Comment } from './comment.model';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [AsyncPipe, DatePipe, FormsModule],
  templateUrl: './comment.html',
  styleUrl: './comment.scss'
})
export class CommentSection implements OnInit {
  private http = inject(HttpClient);

  nodeId = input.required<number>();

  comments$: BehaviorSubject<Comment[]> = new BehaviorSubject<Comment[]>([]);
  newComment = '';
  editingCommentId: number | null = null;
  editingContent = '';

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
    this.http.get<Comment[]>(
      `${environment.backendUrl}/node/${this.nodeId()}/getComments`
    ).subscribe(comments => {
      this.comments$.next(comments);
    });
  }

  addComment(): void {
    if (!this.newComment.trim()) {
      return;
    }
    this.http.post<Comment>(
      `${environment.backendUrl}/node/${this.nodeId()}/addComment`,
      { content: this.newComment }
    ).subscribe(() => {
      this.newComment = '';
      this.loadComments();
    });
  }

  startEdit(comment: Comment): void {
    this.editingCommentId = comment.id;
    this.editingContent = comment.content;
  }

  cancelEdit(): void {
    this.editingCommentId = null;
    this.editingContent = '';
  }

  saveEdit(commentId: number): void {
    if (!this.editingContent.trim()) {
      return;
    }
    this.http.put<Comment>(
      `${environment.backendUrl}/comment/${commentId}`,
      { content: this.editingContent }
    ).subscribe(() => {
      this.editingCommentId = null;
      this.editingContent = '';
      this.loadComments();
    });
  }

  deleteComment(commentId: number): void {
    this.http.delete(
      `${environment.backendUrl}/comment/${commentId}`
    ).subscribe(() => {
      this.loadComments();
    });
  }
}
