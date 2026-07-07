import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ContentNode } from '../content-node/content-node';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-hierarchical-container',
  standalone: true,
  imports: [ContentNode, FormsModule],
  templateUrl: './hierarchical-container.html',
  styleUrl: './hierarchical-container.scss'
})
export class HierarchicalContainer {
  private http = inject(HttpClient);

  showModal = false;

  selectedType = 'project';
  title = '';
  description = '';

  openModal(): void {
    this.selectedType = 'project';
    this.title = '';
    this.description = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  onSubmit(): void {
    this.http.post(`${environment.backendUrl}/addNode`, {
      type: this.selectedType,
      title: this.title,
      description: this.description,
    }).subscribe();
    this.closeModal();
  }
}
