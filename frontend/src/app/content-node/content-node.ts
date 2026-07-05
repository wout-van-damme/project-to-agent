import { Component, input } from '@angular/core';

@Component({
  selector: 'app-content-node',
  standalone: true,
  templateUrl: './content-node.html',
  styleUrl: './content-node.scss'
})
export class ContentNode {
  readonly label = input('Content Node');
}
