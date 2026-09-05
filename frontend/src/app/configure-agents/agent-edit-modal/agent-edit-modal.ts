import { Component, inject, Input, Output, EventEmitter, signal, OnInit, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AgentConfig } from '../configure-agents.model';

@Component({
  selector: 'app-agent-edit-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './agent-edit-modal.html',
})
export class AgentEditModal implements OnInit {
  private http = inject(HttpClient);

  @Input()
  show = signal(false);

  @Input()
  agent!: AgentConfig;

  @Output()
  closed = new EventEmitter<void>();

  @Output()
  saved = new EventEmitter<void>();

  editData = signal({ name: '', provider: '', modelName: '', url: '', apiKey: '', gitRepository: '' });
  providers = [
    { value: 'ollama', label: 'Ollama' },
    { value: 'openai', label: 'OpenAI' },
  ];

  constructor() {
    effect(() => {
      if (this.show() && this.agent) {
        this.loadAgentData();
      }
    });
  }

  ngOnInit(): void {
    if (this.show() && this.agent) {
      this.loadAgentData();
    }
  }

  close(): void {
    this.closed.emit();
  }

  save(): void {
    this.http
      .put<{ message: string }>(
        `${environment.backendUrl}/agents/updateAgent/${this.agent.id}`,
        this.editData(),
      )
      .subscribe(() => {
        this.saved.emit();
        this.close();
      });
  }

  private loadAgentData(): void {
    this.editData.set({
      name: this.agent.name,
      provider: this.agent.provider,
      modelName: this.agent.modelName,
      url: this.agent.url,
      apiKey: '',
      gitRepository: this.agent.gitRepository || '',
    });
  }
}
