import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AgentConfig } from '../configure-agents.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-agent-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  showEditModal = false;
  editData = { name: '', provider: '', modelName: '', url: '', apiKey: '' };
  providers = [
    { value: 'ollama', label: 'Ollama' },
    { value: 'openai', label: 'OpenAI' },
  ];

  maskApiKey(key: string): string {
    if (!key || key.length <= 8) return '••••••••';
    return key.slice(0, 4) + '••••••••' + key.slice(-4);
  }

  openEditModal(): void {
    this.editData = {
      name: this.agent.name,
      provider: this.agent.provider,
      modelName: this.agent.modelName,
      url: this.agent.url,
      apiKey: ''
    };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  saveEdit(): void {
    this.http.put<{ message: string }>(
      `${environment.backendUrl}/agents/updateAgent/${this.agent.id}`,
      this.editData
    ).subscribe(() => {
      this.closeEditModal();
      this.agentUpdated.emit();
    });
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
