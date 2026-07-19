import { Component } from '@angular/core';
import { AgentModal } from './agent-modal/agent-modal';

@Component({
  selector: 'app-configure-agents',
  standalone: true,
  imports: [AgentModal],
  templateUrl: './configure-agents.html',
  styleUrl: './configure-agents.scss'
})
export class ConfigureAgents {
  showModal = false;

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }
}
