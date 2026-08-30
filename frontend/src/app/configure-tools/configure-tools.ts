import { Component, inject, OnInit, signal } from '@angular/core';
import { ToolModal } from './tool-modal/tool-modal';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ToolSetConfig } from './configure-tools.model';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ToolDetailComponent } from './tool-detail/tool-detail.component';

@Component({
  selector: 'app-configure-tools',
  standalone: true,
  imports: [ToolModal, AsyncPipe, ToolDetailComponent],
  templateUrl: './configure-tools.html',
  styleUrl: './configure-tools.scss'
})
export class ConfigureTools {
  private http = inject(HttpClient);

  toolSetConfigs$: BehaviorSubject<ToolSetConfig[]> = new BehaviorSubject<ToolSetConfig[]>([]);
  loading = signal(false);
  showModal = signal(false);

  ngOnInit(): void {
    this.loadToolSetConfigs();
  }

  openModal(): void {
    this.showModal.set(true);
  }

  closeModal(): void {
    this.loadToolSetConfigs();
    this.showModal.set(false);
  }

  updateToolSets(): void {
    this.loadToolSetConfigs();
  }

  deleteToolSet(toolSetId: number): void {
    const current = this.toolSetConfigs$.value;
    this.toolSetConfigs$.next(current.filter(t => t.id !== toolSetId));
  }

  loadToolSetConfigs(): void {
    this.loading.set(true);
    this.http.get<ToolSetConfig[]>(`${environment.backendUrl}/tool-sets/getAllToolSets`)
      .subscribe({
        next: (data) => {
          const sorted = [...data].sort((a, b) => a.id - b.id);
          this.toolSetConfigs$.next(sorted);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        }
      });
  }
}