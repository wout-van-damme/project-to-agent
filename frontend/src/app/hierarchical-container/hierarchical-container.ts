import { Component, signal } from '@angular/core';
import { ContentNode } from '../content-node/content-node';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hierarchical-container',
  standalone: true,
  imports: [ContentNode, FormsModule],
  templateUrl: './hierarchical-container.html',
  styleUrl: './hierarchical-container.scss'
})
export class HierarchicalContainer {
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
    console.log({ type: this.selectedType, title: this.title, description: this.description });
    this.closeModal();
  }
}
