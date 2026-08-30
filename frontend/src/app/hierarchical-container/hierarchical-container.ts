import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ContentNode, Node } from '../content-node/content-node';
import { environment } from '../../environments/environment';
import { AddWorkspaceModal } from './add-workspace-modal/add-workspace-modal';

@Component({
  selector: 'app-hierarchical-container',
  standalone: true,
  imports: [ContentNode, AddWorkspaceModal],
  templateUrl: './hierarchical-container.html',
  styleUrl: './hierarchical-container.scss'
})
export class HierarchicalContainer implements OnInit {
  private http = inject(HttpClient);

  nodes = signal<Node[]>([]);
  showModal = signal(false);
  loading = signal(false);

  ngOnInit(): void {
    this.loadNodes();
  }

  loadNodes(): void {
    this.loading.set(true);
    this.http.get<Node[]>(`${environment.backendUrl}/nodes/getHierarchicalNodes`)
      .subscribe({
        next: (data) => {
          this.nodes.set(data);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        }
      });
  }

  openModal(): void {
    this.showModal.set(true);
  }

  onModalClosed(): void {
    this.showModal.set(false);
  }

  onModalSaved(): void {
    this.loadNodes();
  }
}
