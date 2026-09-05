import { Component, inject, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AgentConfig } from '../configure-agents.model';
import { environment } from '../../../environments/environment';
import { AgentEditModal } from '../agent-edit-modal/agent-edit-modal';

@Component({
  selector: 'app-agent-detail',
  standalone: true,
  imports: [CommonModule, AgentEditModal],
  templateUrl: './agent-detail.component.html',
  styleUrl: './agent-detail.component.scss'
})
export class AgentDetailComponent {

  @Input()
  agent!: AgentConfig;

  @Output()
  agentUpdated = new EventEmitter<void>();

  @Output()
  agentDeleted = new EventEmitter<number>();

  private http = inject(HttpClient);

  showEditModal = signal(false);

  maskApiKey(key: string): string {
    if (!key || key.length <= 8) return '••••••••';
    return key.slice(0, 4) + '••••••••' + key.slice(-4);
  }

  openEditModal(): void {
    this.showEditModal.set(true);
  }

  closeEditModal(): void {
    this.showEditModal.set(false);
  }

  onAgentSaved(): void {
    this.closeEditModal();
    this.agentUpdated.emit();
  }

  deleteAgent(): void {
    if (confirm(`Delete agent "${this.agent.name}"?`)) {
      this.http.delete(`${environment.backendUrl}/agents/deleteAgent/${this.agent.id}`)
        .subscribe(() => {
          this.agentDeleted.emit(this.agent.id);
        });
    }
  }
}
