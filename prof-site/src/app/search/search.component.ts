import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { StrapiService } from '../services/strapi.service';
import { Article, Tutorial, Video, StrapiResponse } from '../interfaces/strapi.interface';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent implements OnInit {
  protected searchQuery = signal('');
  protected isSearching = signal(false);
  protected articles = signal<Article[]>([]);
  protected tutorials = signal<Tutorial[]>([]);
  protected videos = signal<Video[]>([]);
  protected hasSearched = signal(false);

  constructor(
    private strapiService: StrapiService,
    private router: Router
  ) {}

  ngOnInit() {
    // Auto-focus the search input (only in browser)
    if (typeof document !== 'undefined') {
      setTimeout(() => {
        const searchInput = document.querySelector('.search-input') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }, 100);
    }
  }

  protected onSearch(): void {
    const query = this.searchQuery().trim();
    if (!query) return;

    this.isSearching.set(true);
    this.hasSearched.set(true);

    // Search articles
    this.strapiService.searchArticles(query).subscribe({
      next: (articles: StrapiResponse<Article[]>) => {
        this.articles.set(articles.data || []);
      },
      error: (error: any) => {
        console.error('Error searching articles:', error);
        this.articles.set([]);
      }
    });

    // Search tutorials  
    this.strapiService.searchTutorials(query).subscribe({
      next: (tutorials: StrapiResponse<Tutorial[]>) => {
        this.tutorials.set(tutorials.data || []);
      },
      error: (error: any) => {
        console.error('Error searching tutorials:', error);
        this.tutorials.set([]);
      }
    });

    // Search videos
    this.strapiService.searchVideos(query).subscribe({
      next: (videos: StrapiResponse<Video[]>) => {
        this.videos.set(videos.data || []);
        this.isSearching.set(false);
      },
      error: (error: any) => {
        console.error('Error searching videos:', error);
        this.videos.set([]);
        this.isSearching.set(false);
      }
    });
  }

  protected onSearchInputChange(): void {
    const query = this.searchQuery().trim();
    if (query.length >= 3) {
      this.onSearch();
    } else if (query.length === 0) {
      this.clearResults();
    }
  }

  protected clearResults(): void {
    this.articles.set([]);
    this.tutorials.set([]);
    this.videos.set([]);
    this.hasSearched.set(false);
  }

  protected onClearSearch(): void {
    this.searchQuery.set('');
    this.clearResults();
  }

  protected onSuggestionClick(query: string): void {
    this.searchQuery.set(query);
    this.onSearch();
  }

  protected navigateToArticle(article: Article): void {
    this.router.navigate(['/articles', article.documentId]);
  }

  protected navigateToTutorial(tutorial: Tutorial): void {
    this.router.navigate(['/tutorials', tutorial.documentId]);
  }

  protected navigateToVideo(video: Video): void {
    this.router.navigate(['/videos', video.documentId]);
  }

  protected goBack(): void {
    this.router.navigate(['/']);
  }

  // TrackBy functions for performance
  protected trackByArticleId(index: number, article: Article): number {
    return article.id;
  }

  protected trackByTutorialId(index: number, tutorial: Tutorial): number {
    return tutorial.id;
  }

  protected trackByVideoId(index: number, video: Video): number {
    return video.id;
  }
}