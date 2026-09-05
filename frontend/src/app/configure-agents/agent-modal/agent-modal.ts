import { HttpClient } from '@angular/common/http';
import { Component, inject, Input, Output, EventEmitter, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

interface ToolSet {
  id: number;
  name: string;
}

@Component({
  selector: 'app-agent-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './agent-modal.html',
  styleUrl: './agent-modal.scss'
})
export class AgentModal implements OnInit {
  private http = inject(HttpClient);

  @Input() show = signal(false);
  @Output() closed = new EventEmitter<void>();

  name = '';
  provider = 'ollama';
  modelName = '';
  url = '';
  apiKey = '';
  gitRepository = '';
  toolSetId: number | null = null;

  providers = [
    { value: 'ollama', label: 'Ollama' },
  ];

  toolSets: ToolSet[] = [];
  loadingToolSets = signal(false);

  ngOnInit(): void {
    this.loadToolSets();
  }

  loadToolSets(): void {
    this.loadingToolSets.set(true);
    this.http.get<ToolSet[]>(`${environment.backendUrl}/tool-sets/getAllToolSets`).subscribe({
      next: (data) => {
        this.toolSets = data;
        this.loadingToolSets.set(false);
      },
      error: (err) => {
        console.error('Failed to load tool sets', err);
        this.loadingToolSets.set(false);
      }
    });
  }

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
            apiKey: '',
            gitRepository: this.gitRepository,
            tool_set_id: this.toolSetId
          }
        ).subscribe(() => {
            this.name = '';
            this.provider = 'ollama';
            this.modelName = '';
            this.url = '';
            this.apiKey = '';
            this.gitRepository = '';
            this.toolSetId = null;
            this.closed.emit();
        });
  }
}
