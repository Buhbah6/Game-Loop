import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StrapiService } from '../services/strapi.service';
import { Article, Tutorial, Video } from '../interfaces/strapi.interface';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {
  featuredArticle$: Observable<Article | undefined>;
  featuredTutorials$: Observable<Tutorial[]>;
  featuredVideo$: Observable<Video | undefined>;

  constructor(
    private strapiService: StrapiService,
    private router: Router
  ) {
    this.featuredArticle$ = this.strapiService.getFeaturedArticles().pipe(
      map(articles => articles[0])
    );
    
    this.featuredTutorials$ = this.strapiService.getFeaturedTutorials();
    
    this.featuredVideo$ = this.strapiService.getFeaturedVideos().pipe(
      map(videos => videos[0])
    );
  }

  ngOnInit() {}

  navigateToArticle(article: Article) {
    this.router.navigate(['/article', article.documentId]);
  }

  navigateToTutorial(tutorial: Tutorial) {
    this.router.navigate(['/tutorial', tutorial.documentId]);
  }

  navigateToVideo(video: Video) {
    this.router.navigate(['/video', video.documentId]);
  }

  navigateToArticles() {
    this.router.navigate(['/articles']);
  }

  navigateToTutorials() {
    this.router.navigate(['/tutorials']);
  }

  navigateToVideos() {
    this.router.navigate(['/videos']);
  }
}