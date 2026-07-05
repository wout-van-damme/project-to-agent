import { Component } from '@angular/core';
import { ContentNode } from '../content-node/content-node';

@Component({
  selector: 'app-hierarchical-container',
  standalone: true,
  imports: [ContentNode],
  templateUrl: './hierarchical-container.html',
  styleUrl: './hierarchical-container.scss'
})
export class HierarchicalContainer {
}