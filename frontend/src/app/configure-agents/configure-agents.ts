import { Component, inject, OnInit, signal } from '@angular/core';
import { AgentModal } from './agent-modal/agent-modal';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AgentConfig } from './configure-agents.model';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { AgentDetailComponent } from './agent-detail/agent-detail.component';

@Component({
  selector: 'app-configure-agents',
  standalone: true,
  imports: [AgentModal, AsyncPipe, AgentDetailComponent],
  templateUrl: './configure-agents.html',
  styleUrl: './configure-agents.scss'
})
export class ConfigureAgents {
  private http = inject(HttpClient);

  agentConfigs$: BehaviorSubject<AgentConfig[]> = new BehaviorSubject<AgentConfig[]>([]);;
  loading = signal(false);
  showModal = signal(false);

  ngOnInit(): void {
    this.loadAgentConfigs();
  }

  openModal(): void {
    this.showModal.set(true);
  }

  closeModal(): void {
    this.loadAgentConfigs();
    this.showModal.set(false);
  }

  onAgentUpdated(): void {
    this.loadAgentConfigs();
  }

  onAgentDeleted(agentId: number): void {
    const current = this.agentConfigs$.value;
    this.agentConfigs$.next(current.filter(a => a.id !== agentId));
  }


loadAgentConfigs(): void {
    this.loading.set(true);
    this.http.get<[AgentConfig]>(`${environment.backendUrl}/agents/getAllAgents`)
      .subscribe({
        next: (data) => {
          const sorted = [...data].sort((a, b) => a.id - b.id);
          this.agentConfigs$.next(sorted);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        }
      });
  }
}
