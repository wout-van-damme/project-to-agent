import { Component, inject, OnInit } from '@angular/core';
import { ToolModal } from './tool-modal/tool-modal';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ToolConfig } from './configure-tools.model';
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

  toolConfigs$: BehaviorSubject<ToolConfig[]> = new BehaviorSubject<ToolConfig[]>([]);

  showModal = false;

  ngOnInit(): void {
    this.loadToolConfigs();
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.loadToolConfigs();
    this.showModal = false;
  }

  onToolUpdated(): void {
    this.loadToolConfigs();
  }

  onToolDeleted(toolId: number): void {
    const current = this.toolConfigs$.value;
    this.toolConfigs$.next(current.filter(t => t.id !== toolId));
  }

  loadToolConfigs(): void {
    this.http.get<[ToolConfig]>(`${environment.backendUrl}/tools/getAllTools`)
      .subscribe((data) => {
        const sorted = [...data].sort((a, b) => a.id - b.id);
        this.toolConfigs$.next(sorted);
      });
  }
}