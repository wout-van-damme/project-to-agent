import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import { Node } from '../content-node/content-node';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-node-detail',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './node-detail.html',
  styleUrl: './node-detail.scss'
})
export class NodeDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);
  private sanitizer = inject(DomSanitizer);


  node$: Observable<Node> | undefined;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
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
}
