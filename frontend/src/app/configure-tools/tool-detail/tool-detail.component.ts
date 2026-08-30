import { Component, inject, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ToolSetConfig } from '../configure-tools.model';
import { environment } from '../../../environments/environment';
import { ToolDetailEditModal } from '../tool-detail-edit-modal/tool-detail-edit-modal';

@Component({
  selector: 'app-tool-detail',
  standalone: true,
  imports: [CommonModule, ToolDetailEditModal],
  templateUrl: './tool-detail.component.html',
  styleUrl: './tool-detail.component.scss'
})
export class ToolDetailComponent {

  @Input()
  toolSet!: ToolSetConfig;

  @Output()
  toolSetUpdated = new EventEmitter<void>();

  @Output()
  toolSetDeleted = new EventEmitter<number>();

  private http = inject(HttpClient);

  showEditModal = signal(false);

  openEditModal(): void {
    this.showEditModal.set(true);
  }

  onEditModalClosed(): void {
    this.showEditModal.set(false);
  }

  onEditModalSaved(): void {
    this.toolSetUpdated.emit();
  }

  deleteToolSet(): void {
    if (confirm(`Delete tool set "${this.toolSet.name}"?`)) {
      this.http.delete(`${environment.backendUrl}/tool-sets/deleteToolSet/${this.toolSet.id}`)
        .subscribe(() => {
          this.toolSetDeleted.emit(this.toolSet.id);
        });
    }
  }
}