import { Routes } from '@angular/router';
import { HomeView } from './home-view/home-view';
import { NotFoundView } from './not-found-view/not-found-view';

export const routes: Routes = [
  { path: 'home', component: HomeView },
  // default
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  // catch all for not found
  { path: '**', component: NotFoundView },
];
