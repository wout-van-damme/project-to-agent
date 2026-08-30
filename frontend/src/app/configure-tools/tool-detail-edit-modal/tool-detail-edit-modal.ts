import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ToolConfig } from '../configure-tools.model';

@Component({
  selector: 'app-tool-detail-edit-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './tool-detail-edit-modal.html',
  styleUrl: './tool-detail-edit-modal.scss'
})
export class ToolDetailEditModal implements OnInit {
  private http = inject(HttpClient);

  @Input() show = signal(false);
  @Input() toolSetName = '';
  @Input() toolSetId!: number;
  @Input() currentToolIds: number[] = [];
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  editName = '';
  availableTools$: BehaviorSubject<ToolConfig[]> = new BehaviorSubject<ToolConfig[]>([]);
  selectedToolIds: number[] = [];
  loading = signal(false);

  ngOnInit(): void {
    this.loadAvailableTools();
    this.editName = this.toolSetName;
    this.selectedToolIds = [...this.currentToolIds];
  }

  loadAvailableTools(): void {
    this.loading.set(true);
    this.http.get<ToolConfig[]>(`${environment.backendUrl}/tools/getAllTools`)
      .subscribe({
        next: (tools) => {
          this.availableTools$.next(tools);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        }
      });
  }

  close(): void {
    this.editName = '';
    this.selectedToolIds = [];
    this.closed.emit();
  }

  onSubmit(): void {
    if (!this.editName.trim()) {
      return;
    }
    this.http.put(
      `${environment.backendUrl}/tool-sets/updateToolSet/${this.toolSetId}`,
      { name: this.editName, tool_ids: this.selectedToolIds }
    ).subscribe(() => {
      this.editName = '';
      this.selectedToolIds = [];
      this.saved.emit();
      this.closed.emit();
    });
  }

  toggleTool(toolId: number): void {
    const index = this.selectedToolIds.indexOf(toolId);
    if (index > -1) {
      this.selectedToolIds.splice(index, 1);
    } else {
      this.selectedToolIds.push(toolId);
    }
  }

  isSelected(toolId: number): boolean {
    return this.selectedToolIds.includes(toolId);
  }
}