import { ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import { Node, AgentConfig } from '../content-node/content-node';
import { Comment } from '../comment/comment.model';
import { environment } from '../../environments/environment';
import { BehaviorSubject, map, Observable } from 'rxjs';
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

  @ViewChild(CommentSection) commentSection!: CommentSection;

  node$: Observable<Node> | undefined;
  editMode = false;
  editDescription = '';
  editStatus = 'todo';
  editAgentId: number | null = null;
  agents$: BehaviorSubject<AgentConfig[]> = new BehaviorSubject<AgentConfig[]>([]);
  currentNodeId: number | null = null;
  isPlaying = false;

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

  play(): void {
    if (this.currentNodeId === null || this.isPlaying) return;
    this.isPlaying = true;
    this.http.post<Comment>(
      `${environment.backendUrl}/play/${this.currentNodeId}`,
      {}
    ).subscribe({
      next: () => {
        this.isPlaying = false;
        this.node$ = this.http.get<Node>(`${environment.backendUrl}/node/getNode/${this.currentNodeId}`);
        this.commentSection?.loadComments();
      },
      error: (err) => {
        this.isPlaying = false;
        console.error(err);
      }
    });
  }

  startEdit(node: Node): void {
    this.editDescription = node.description;
    this.editStatus = node.status || 'todo';
    this.editAgentId = node.agent ? node.agent.id : null;
    this.loadAgents();
    this.editMode = true;
  }

  loadAgents(): void {
    this.http.get<AgentConfig[]>(`${environment.backendUrl}/agents/getAllAgents`).pipe(
      map(data => [...data].sort((a, b) => a.name.localeCompare(b.name)))
    ).subscribe((agents) => {
      this.agents$.next(agents);
    })
  }

  cancelEdit(): void {
    this.editMode = false;
    this.editDescription = '';
    this.editStatus = 'todo';
    this.editAgentId = null;
  }

  saveEdit(): void {
    if (this.currentNodeId === null) return;
    this.http.put<Node>(
      `${environment.backendUrl}/node/updateNode/${this.currentNodeId}`,
      { description: this.editDescription, status: this.editStatus, agent_id: this.editAgentId }
    ).subscribe((updated) => {
      this.node$ = new Observable<Node>(observer => {
        observer.next(updated);
        observer.complete();
      });
      this.editMode = false;
      this.cdr.markForCheck();
    });
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'review me':
        return 'fa-regular fa-square-check status-gray';
      case 'reviewed':
        return 'fa-solid fa-square-check status-green';
      case 'question':
        return 'fa-solid fa-question';
      case 'in progress':
        return 'fa-solid fa-circle-notch fa-spin';
      case 'todo':
        return 'fa-regular fa-circle';
      default:
        return '';
    }
  }
}
