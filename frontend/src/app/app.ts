import { Component } from '@angular/core';
import { HierarchicalContainer } from './hierarchical-container/hierarchical-container';

@Component({
  selector: 'app-root',
  imports: [HierarchicalContainer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
}
