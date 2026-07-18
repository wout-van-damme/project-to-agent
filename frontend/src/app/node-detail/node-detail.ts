import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import { Node } from '../content-node/content-node';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommentSection } from '../comment/comment';

@Component({
  selector: 'app-node-detail',
  standalone: true,
  imports: [AsyncPipe, FormsModule, CommentSection],
  templateUrl: './node-detail.html',
  styleUrl: './node-detail.scss'
})
export class NodeDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);
  private sanitizer = inject(DomSanitizer);

  node$: Observable<Node> | undefined;
  editMode = false;
  editDescription = '';
  currentNodeId: number | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.currentNodeId = Number(id);
      this.node$ = this.http.get<Node>(`${environment.backendUrl}/node/getNode/${id}`);
    }
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
