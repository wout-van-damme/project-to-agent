import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-agent-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './agent-modal.html',
  styleUrl: './agent-modal.scss'
})
export class AgentModal {
  show = input(false);
  closed = output<void>();

  name = '';
  provider = 'ollama';
  modelName = '';
  url = '';
  apiKey = '';

  providers = [
    { value: 'ollama', label: 'Ollama' }, // TODO
  ];

  close(): void {
    this.closed.emit();
  }

  onSubmit(): void {
    this.closed.emit();
  }
}
