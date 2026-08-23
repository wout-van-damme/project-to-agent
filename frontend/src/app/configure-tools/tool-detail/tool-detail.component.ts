import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ToolConfig } from '../configure-tools.model';
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
  tool!: ToolConfig;

  @Output()
  toolUpdated = new EventEmitter<void>();

  @Output()
  toolDeleted = new EventEmitter<number>();

  private http = inject(HttpClient);

  showEditModal = false;
  editName = '';

  openEditModal(): void {
    this.editName = this.tool.name;
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  saveEdit(): void {
    this.http.put(
      `${environment.backendUrl}/tools/updateTool/${this.tool.id}`,
      { name: this.editName }
    ).subscribe(() => {
      this.closeEditModal();
      this.toolUpdated.emit();
    });
  }

  deleteTool(): void {
    if (confirm(`Delete tool "${this.tool.name}"?`)) {
      this.http.delete(`${environment.backendUrl}/tools/deleteTool/${this.tool.id}`)
        .subscribe(() => {
          this.toolDeleted.emit(this.tool.id);
        });
    }
  }
}