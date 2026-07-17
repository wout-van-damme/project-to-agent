import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import { Node } from '../content-node/content-node';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { AsyncPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Comment {
  id: number;
  node_id: number;
  creator: string;
  content: string;
  created_at: string;
}

@Component({
  selector: 'app-node-detail',
  standalone: true,
  imports: [AsyncPipe, FormsModule, DatePipe],
  templateUrl: './node-detail.html',
  styleUrl: './node-detail.scss'
})
export class NodeDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);
  private sanitizer = inject(DomSanitizer);

  node$: Observable<Node> | undefined;
  comments$: BehaviorSubject<Comment[]> = new BehaviorSubject<Comment[]>([]);
  editMode = false;
  editDescription = '';
  newComment = '';
  currentNodeId: number | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.currentNodeId = Number(id);
      this.node$ = this.http.get<Node>(`${environment.backendUrl}/node/getNode/${id}`);
      this.loadComments();
    }
  }

  loadComments(): void {
    if (this.currentNodeId === null) {
      return;
    };
    this.http.get<Comment[]>(
      `${environment.backendUrl}/node/${this.currentNodeId}/getComments`
    ).subscribe(comments => {
      this.comments$.next(comments);
    });
  }

  addComment(): void {
    if (this.currentNodeId === null || !this.newComment.trim()) {
      return
    };
    this.http.post<Comment>(
      `${environment.backendUrl}/node/${this.currentNodeId}/addComment`,
      { content: this.newComment }
    ).subscribe(() => {
      this.newComment = '';
      this.loadComments();
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  renderMarkdown(text: string): SafeHtml {
    const html = marked.parse(text) as string;
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  startEdit(description: string): void {
    this.editDescription = description;
    this.editMode = true;
  }

  cancelEdit(): void {
    this.editMode = false;
    this.editDescription = '';
  }

  saveEdit(): void {
    if (this.currentNodeId === null) return;
    this.http.put<Node>(
      `${environment.backendUrl}/node/updateNode/${this.currentNodeId}`,
      { description: this.editDescription }
    ).subscribe((updated) => {
      this.node$ = new Observable<Node>(observer => {
        observer.next(updated);
        observer.complete();
      });
      this.editMode = false;
      this.cdr.markForCheck();
    });
  }
}
