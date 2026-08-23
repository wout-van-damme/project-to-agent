import { HttpClient } from '@angular/common/http';
import { Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-tool-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './tool-modal.html',
  styleUrl: './tool-modal.scss'
})
export class ToolModal {
  private http = inject(HttpClient);

  show = input(false);
  closed = output<void>();

  name = '';

  close(): void {
    this.closed.emit();
  }

  onSubmit(): void {
    this.http.post(
      `${environment.backendUrl}/tools/addTool`,
      { name: this.name }
    ).subscribe(() => {
      this.name = '';
      this.closed.emit();
    });
  }
}