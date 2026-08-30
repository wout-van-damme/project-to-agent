import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ToolConfig, ToolSetConfig } from '../configure-tools.model';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-tool-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './tool-modal.html',
  styleUrl: './tool-modal.scss'
})
export class ToolModal implements OnInit {
  private http = inject(HttpClient);

  @Input()
  show = signal(false);
  @Output()
  closed = new EventEmitter<void>();

  availableTools$: BehaviorSubject<ToolConfig[]> = new BehaviorSubject<ToolConfig[]>([]);
  selectedToolIds: number[] = [];
  toolSetName = '';
  loading = signal(false);

  ngOnInit(): void {
    this.loadAvailableTools();
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
    this.selectedToolIds = [];
    this.toolSetName = '';
    this.closed.emit();
  }

  onSubmit(): void {
    if (!this.toolSetName.trim() || this.selectedToolIds.length === 0) {
      return;
    }
    this.http.post<ToolSetConfig>(
      `${environment.backendUrl}/tool-sets/addToolSet`,
      { name: this.toolSetName, tool_ids: this.selectedToolIds }
    ).subscribe(() => {
      this.selectedToolIds = [];
      this.toolSetName = '';
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