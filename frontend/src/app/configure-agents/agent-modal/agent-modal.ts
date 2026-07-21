import { HttpClient } from '@angular/common/http';
import { Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-agent-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './agent-modal.html',
  styleUrl: './agent-modal.scss'
})
export class AgentModal {
  private http = inject(HttpClient);

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
    this.http.post<Comment>(
          `${environment.backendUrl}/agents/addAgent`,
          {
            id: '',
            name: this.name,
            provider: this.provider,
            modelName: this.modelName,
            url: this.url,
            // TODO: apiKey: this.apiKey SHOULD BE ENCRYPTED
            apiKey: ''
          }
        ).subscribe(() => {
            this.name = '';
            this.provider = 'ollama';
            this.modelName = '';
            this.url = '';
            this.apiKey = '';
            this.closed.emit();
        });
  }
}
