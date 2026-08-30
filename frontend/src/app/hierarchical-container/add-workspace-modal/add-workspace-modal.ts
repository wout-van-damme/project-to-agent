import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, Output, EventEmitter, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-add-workspace-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-workspace-modal.html',
  styleUrl: './add-workspace-modal.scss'
})
export class AddWorkspaceModal {
  private http = inject(HttpClient);

  @Input() show = signal(false);
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  selectedType = 'workspace';
  title = '';
  description = '';

  close(): void {
    this.title = '';
    this.description = '';
    this.closed.emit();
  }

  onSubmit(): void {
    this.http.post(`${environment.backendUrl}/node/addNode`, {
      parent_id: null,
      type: this.selectedType,
      title: this.title,
      description: this.description,
    }).subscribe(() => {
      this.saved.emit();
      this.close();
    });
  }
}