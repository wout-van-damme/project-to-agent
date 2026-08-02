import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { environment } from '../../environments/environment';

export interface Node {
  id: number;
  type: string;
  title: string;
  description: string;
  nodes: Node[];
  agents?: AgentConfig[];
}

export interface AgentConfig {
  id: number;
  name: string;
  provider: string;
  modelName: string;
  url: string;
  apiKey: string;
}

@Component({
  selector: 'app-content-node',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './content-node.html',
  styleUrl: './content-node.scss'
})
export class ContentNode {
  private http = inject(HttpClient);

  readonly node = input.required<Node>();
  readonly nodeAdded = output<void>();

  expanded = false;
  showModal = false;
  selectedType = '';
  title = '';
  description = '';
  agents: AgentConfig[] = [];
  selectedAgentIds: (number | null)[] = [];

  get hasChildren(): boolean {
    return this.node().nodes.length > 0;
  }

  get isTask(): boolean {
    return this.node().type === 'task';
  }

  get isTaskTypeSelected(): boolean {
    return this.selectedType === 'task';
  }

  get isTaskFormValid(): boolean {
    return this.title.trim().length > 0 && this.selectedAgentIds.length > 0;
  }

  openModal(): void {
    this.selectedType = '';
    this.title = '';
    this.description = '';
    this.selectedAgentIds = [null];
    this.loadAgents();
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  loadAgents(): void {
    if (this.agents.length > 0) {
      return;
    }
    this.http.get<AgentConfig[]>(`${environment.backendUrl}/agents/getAllAgents`)
      .subscribe((data) => {
        this.agents = [...data].sort((a, b) => a.name.localeCompare(b.name));
      });
  }

  onTypeChange(): void {
    if (this.selectedType !== 'task') {
      this.selectedAgentIds = [];
    }
  }

  addAgentSelector(): void {
    this.selectedAgentIds.push(null);
  }

  removeAgentSelector(index: number): void {
    this.selectedAgentIds.splice(index, 1);
  }

  trackByFn(index: number): number {
    return index;
  }

  onSubmit(): void {
    const agentIds = this.selectedAgentIds.filter((id): id is number => id !== null);
    this.http.post(`${environment.backendUrl}/node/addNode`, {
      parent_id: this.node().id,
      type: this.selectedType,
      title: this.title,
      description: this.description,
      agent_ids: this.selectedType === 'task' ? agentIds : [],
    }).subscribe(() => {
      this.nodeAdded.emit();
      this.closeModal();
    });
  }

  setExpand(expanded: boolean): void {
    this.expanded = expanded;
  }
}