import { Component, input } from '@angular/core';

export interface Node {
  id: number;
  type: string;
  title: string;
  description: string;
  nodes: Node[];
}

@Component({
  selector: 'app-content-node',
  standalone: true,
  templateUrl: './content-node.html',
  styleUrl: './content-node.scss'
})
export class ContentNode {
  readonly node = input.required<Node>();
}
