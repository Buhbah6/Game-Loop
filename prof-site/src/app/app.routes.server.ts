import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'search',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'articles',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'tutorials',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'videos',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'about',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'articles/**',
    renderMode: RenderMode.Client
  },
  {
    path: 'tutorials/**',
    renderMode: RenderMode.Client
  },
  {
    path: 'videos/**',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Client
  }
];
