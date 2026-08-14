import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { environment } from '../../environments/environment';

const EXPANDED_NODES_KEY = 'expandedNodes';

function getExpandedNodeIds(): Set<number> {
  try {
    const raw = localStorage.getItem(EXPANDED_NODES_KEY);
    return new Set<number>(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

export interface Node {
  id: number;
  type: string;
  title: string;
  description: string;
  nodes: Node[];
  agent?: AgentConfig;
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
export class ContentNode implements OnInit {
  private http = inject(HttpClient);

  readonly node = input.required<Node>();
  readonly nodeAdded = output<void>();

  expanded = false;

  ngOnInit(): void {
    this.expanded = this.hasChildren && getExpandedNodeIds().has(this.node().id);
  }
  showModal = false;
  selectedType = '';
  title = '';
  description = '';
  agents: AgentConfig[] = [];
  selectedAgentId: number | null = null;

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
    return this.title.trim().length > 0 && this.selectedAgentId !== null;
  }

  openModal(): void {
    this.selectedType = '';
    this.title = '';
    this.description = '';
    this.selectedAgentId = null;
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
      this.selectedAgentId = null;
    }
  }

  onSubmit(): void {
    this.http.post(`${environment.backendUrl}/node/addNode`, {
      parent_id: this.node().id,
      type: this.selectedType,
      title: this.title,
      description: this.description,
      agent_id: this.selectedType === 'task' ? this.selectedAgentId : null,
    }).subscribe(() => {
      this.nodeAdded.emit();
      this.closeModal();
    });
  }

  setExpand(expanded: boolean): void {
    this.expanded = expanded;
    const ids = getExpandedNodeIds();
    if (expanded) {
      ids.add(this.node().id);
    } else {
      ids.delete(this.node().id);
    }
    localStorage.setItem(EXPANDED_NODES_KEY, JSON.stringify([...ids]));
  }
}