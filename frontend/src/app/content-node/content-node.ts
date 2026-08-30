import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { AddNodeModal } from './add-node-modal/add-node-modal';

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
  status: string;
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
  imports: [RouterLink, AddNodeModal],
  templateUrl: './content-node.html',
  styleUrl: './content-node.scss'
})
export class ContentNode implements OnInit {
  private http = inject(HttpClient);

  @Input({ required: true }) node!: Node;
  @Output() nodeAdded = new EventEmitter<void>();

  expanded = false;
  showModal = signal(false);

  ngOnInit(): void {
    this.expanded = this.hasChildren && getExpandedNodeIds().has(this.node.id);
  }

  get hasChildren(): boolean {
    return this.node.nodes.length > 0;
  }

  get isTask(): boolean {
    return this.node.type === 'task';
  }

  openModal(): void {
    this.showModal.set(true);
  }

  onModalClosed(): void {
    this.showModal.set(false);
  }

  onModalSaved(): void {
    this.nodeAdded.emit();
  }

  setExpand(expanded: boolean): void {
    this.expanded = expanded;
    const ids = getExpandedNodeIds();
    if (expanded) {
      ids.add(this.node.id);
    } else {
      ids.delete(this.node.id);
    }
    localStorage.setItem(EXPANDED_NODES_KEY, JSON.stringify([...ids]));
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'review me':
        return 'fa-regular fa-square-check status-gray';
      case 'reviewed':
        return 'fa-solid fa-square-check status-green';
      case 'question':
        return 'fa-solid fa-question';
      case 'in progress':
        return 'fa-solid fa-circle-notch fa-spin';
      case 'todo':
        return 'fa-regular fa-circle';
      default:
        return '';
    }
  }
}