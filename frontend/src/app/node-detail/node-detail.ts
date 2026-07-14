import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Node } from '../content-node/content-node';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-node-detail',
  standalone: true,
  imports: [],
  templateUrl: './node-detail.html',
  styleUrl: './node-detail.scss'
})
export class NodeDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);

  node: Node | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.http.get<Node>(`${environment.backendUrl}/node/getNode/${id}`)
        .subscribe((data) => this.node = data);
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
