import { Routes } from '@angular/router';
import { HierarchicalContainer } from './hierarchical-container/hierarchical-container';

export const routes: Routes = [
  { path: '', component: HierarchicalContainer },
  { path: 'node/:id', loadComponent: () => import('./node-detail/node-detail').then(m => m.NodeDetail) },
  { path: 'configure-agents', loadComponent: () => import('./configure-agents/configure-agents').then(m => m.ConfigureAgents) },
  { path: 'configure-tools', loadComponent: () => import('./configure-tools/configure-tools').then(m => m.ConfigureTools) },
];
