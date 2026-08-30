import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, Output, EventEmitter, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

export interface AgentConfig {
  id: number;
  name: string;
  provider: string;
  modelName: string;
  url: string;
  apiKey: string;
}

@Component({
  selector: 'app-add-node-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-node-modal.html',
  styleUrl: './add-node-modal.scss'
})
export class AddNodeModal implements OnInit {
  private http = inject(HttpClient);

  @Input() show = signal(false);
  @Input() parentId!: number;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  selectedType = '';
  title = '';
  description = '';
  agents: AgentConfig[] = [];
  selectedAgentId: number | null = null;
  loadingAgents = signal(false);

  ngOnInit(): void {
    this.loadAgents();
  }

  get isTaskTypeSelected(): boolean {
    return this.selectedType === 'task';
  }

  get isTaskFormValid(): boolean {
    return this.title.trim().length > 0 && this.selectedAgentId !== null;
  }

  close(): void {
    this.selectedType = '';
    this.title = '';
    this.description = '';
    this.selectedAgentId = null;
    this.closed.emit();
  }

  loadAgents(): void {
    this.loadingAgents.set(true);
    this.http.get<AgentConfig[]>(`${environment.backendUrl}/agents/getAllAgents`)
      .subscribe({
        next: (data) => {
          this.agents = [...data].sort((a, b) => a.name.localeCompare(b.name));
          this.loadingAgents.set(false);
        },
        error: () => {
          this.loadingAgents.set(false);
        }
      });
  }

  onTypeChange(): void {
    if (this.selectedType !== 'task') {
      this.selectedAgentId = null;
    }
  }

  onSubmit(): void {
    this.http.post(`${environment.backendUrl}/node/addNode`, {
      parent_id: this.parentId,
      type: this.selectedType,
      title: this.title,
      description: this.description,
      agent_id: this.selectedType === 'task' ? this.selectedAgentId : null,
    }).subscribe(() => {
      this.saved.emit();
      this.close();
    });
  }
}