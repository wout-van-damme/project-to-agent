import { Component, inject, input, output, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';

export interface Node {
  id: number;
  type: string;
  title: string;
  description: string;
  nodes: Node[];
}

@Component({
  selector: 'app-content-node',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './content-node.html',
  styleUrl: './content-node.scss'
})
export class ContentNode {
  private http = inject(HttpClient);

  readonly node = input.required<Node>();
  readonly nodeAdded = output<void>();

  expanded = false;
  showModal = false;
  selectedType = '';
  title = '';
  description = '';

  get hasChildren(): boolean {
    return this.node().nodes.length > 0;
  }

  get isTask(): boolean {
    return this.node().type === 'task';
  }

  openModal(): void {
    this.selectedType = '';
    this.title = '';
    this.description = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  onSubmit(): void {
    this.http.post(`${environment.backendUrl}/node/addNode`, {
      parent_id: this.node().id,
      type: this.selectedType,
      title: this.title,
      description: this.description,
    }).subscribe(() => {
      this.nodeAdded.emit();
      this.closeModal();
    });
  }

  setExpand(expanded: boolean): void {
    this.expanded = expanded;
  }
}
