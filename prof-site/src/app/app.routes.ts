import { Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { ArticlesMainComponent } from './articles-main/articles-main.component';
import { TutorialsMainComponent } from './tutorials-main/tutorials-main.component';
import { VideosMainComponent } from './videos-main/videos-main.component';
import { AboutComponent } from './about/about.component';
import { ArticleComponent } from './article/article.component';
import { TutorialComponent } from './tutorial/tutorial.component';
import { VideoComponent } from './video/video.component';
import { SearchComponent } from './search/search.component';

export const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'search', component: SearchComponent },
  { path: 'articles', component: ArticlesMainComponent },
  { path: 'articles/:id', component: ArticleComponent },
  { path: 'tutorials', component: TutorialsMainComponent },
  { path: 'tutorials/:id', component: TutorialComponent },
  { path: 'videos', component: VideosMainComponent },
  { path: 'videos/:id', component: VideoComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', redirectTo: '' }
];
