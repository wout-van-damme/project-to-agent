import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, Output, EventEmitter, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-tool-detail-edit-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './tool-detail-edit-modal.html',
  styleUrl: './tool-detail-edit-modal.scss'
})
export class ToolDetailEditModal {
  private http = inject(HttpClient);

  @Input() show = signal(false);
  @Input() toolSetName = '';
  @Input() toolSetId!: number;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  editName = '';

  close(): void {
    this.editName = '';
    this.closed.emit();
  }

  onSubmit(): void {
    if (!this.editName.trim()) {
      return;
    }
    this.http.put(
      `${environment.backendUrl}/tool-sets/updateToolSet/${this.toolSetId}`,
      { name: this.editName }
    ).subscribe(() => {
      this.editName = '';
      this.saved.emit();
      this.closed.emit();
    });
  }
}