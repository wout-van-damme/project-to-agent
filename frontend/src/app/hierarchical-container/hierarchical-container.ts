import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ContentNode, Node } from '../content-node/content-node';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-hierarchical-container',
  standalone: true,
  imports: [ContentNode, FormsModule],
  templateUrl: './hierarchical-container.html',
  styleUrl: './hierarchical-container.scss'
})
export class HierarchicalContainer implements OnInit {
  private http = inject(HttpClient);

  nodes = signal<Node[]>([]);
  showModal = false;

  selectedType = 'workspace';
  title = '';
  description = '';

  ngOnInit(): void {
    this.loadNodes();
  }

  loadNodes(): void {
    this.http.get<Node[]>(`${environment.backendUrl}/nodes/getHierarchicalNodes`)
      .subscribe((data) => this.nodes.set(data));
  }

  openModal(): void {
    this.selectedType = 'workspace';
    this.title = '';
    this.description = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  onSubmit(): void {
    this.http.post(`${environment.backendUrl}/node/addNode`, {
      parent_id: null,
      type: this.selectedType,
      title: this.title,
      description: this.description,
    }).subscribe(() => {
      this.loadNodes();
      this.closeModal();
    });
  }
}
