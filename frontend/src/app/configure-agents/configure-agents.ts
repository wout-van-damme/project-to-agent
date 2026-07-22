import { Component, inject, OnInit } from '@angular/core';
import { AgentModal } from './agent-modal/agent-modal';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AgentConfig } from './configure-agents.model';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-configure-agents',
  standalone: true,
  imports: [AgentModal, AsyncPipe],
  templateUrl: './configure-agents.html',
  styleUrl: './configure-agents.scss'
})
export class ConfigureAgents {
  private http = inject(HttpClient);

  agentConfigs$: BehaviorSubject<AgentConfig[]> = new BehaviorSubject<AgentConfig[]>([]);;

  showModal = false;

  ngOnInit(): void {
    this.loadAgentConfigs();
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.loadAgentConfigs();
    this.showModal = false;
  }


  loadAgentConfigs(): void {
    this.http.get<[AgentConfig]>(`${environment.backendUrl}/agents/getAllAgents`)
      .subscribe((data) => {
        this.agentConfigs$.next(data);
      });
  }
}
