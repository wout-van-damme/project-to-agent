import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ToolSetConfig, ToolConfig } from '../configure-tools.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-tool-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  showEditModal = false;
  editName = '';

  openEditModal(): void {
    this.editName = this.toolSet.name;
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  saveEdit(): void {
    this.http.put(
      `${environment.backendUrl}/tool-sets/updateToolSet/${this.toolSet.id}`,
      { name: this.editName }
    ).subscribe(() => {
      this.closeEditModal();
      this.toolSetUpdated.emit();
    });
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