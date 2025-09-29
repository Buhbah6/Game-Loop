import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable, BehaviorSubject, combineLatest, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { StrapiService } from '../services/strapi.service';
import { Article } from '../interfaces/strapi.interface';

@Component({
  selector: 'app-articles-main',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './articles-main.component.html',
  styleUrl: './articles-main.component.scss'
})
export class ArticlesMainComponent implements OnInit {
  allArticles$: Observable<Article[]>;
  filteredArticles$: Observable<Article[]>;
  
  // State for filtering
  private selectedCategorySubject = new BehaviorSubject<string>('All');
  selectedCategory$ = this.selectedCategorySubject.asObservable();

  categories = ['All', 'Game Design', 'Programming', 'Art', 'Marketing', 'Business'];
  selectedCategory = 'All';

  constructor(
    private strapiService: StrapiService,
    private router: Router
  ) {
    // Load all articles from Strapi
    this.allArticles$ = this.strapiService.getArticles({
      pagination: { limit: 100 }
    }).pipe(
      map(articles => {
        console.log('Articles loaded:', articles);
        // If no articles from Strapi or empty array, use mock data
        if (!articles || articles.length === 0) {
          console.log('No articles from Strapi, using mock data');
          return this.getMockArticles() as Article[];
        }
        return articles;
      }),
      catchError(() => {
        console.log('Error loading articles, using mock data');
        return of(this.getMockArticles() as Article[]);
      })
    );

    // Filter articles based on selected category
    this.filteredArticles$ = combineLatest([
      this.allArticles$,
      this.selectedCategory$
    ]).pipe(
      map(([articles, category]) => {
        if (category === 'All') {
          return articles;
        }
        // For now, we'll filter by title content since Strapi articles may not have category field
        return articles.filter(article => 
          article.title.toLowerCase().includes(category.toLowerCase()) ||
          article.summary?.toLowerCase().includes(category.toLowerCase())
        );
      })
    );
  }

  ngOnInit() {
    console.log('ArticlesMainComponent initialized');
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.selectedCategorySubject.next(category);
  }

  navigateToArticle(article: Article) {
    this.router.navigate(['/articles', article.documentId]);
  }

  getFormattedDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  }

  getStrapiImageUrl(url: string): string {
    if (!url) return '';
    // If URL is already complete, return as is
    if (url.startsWith('http')) {
      return url;
    }
    // If URL is relative, prepend Strapi base URL
    return `http://localhost:1337${url}`;
  }

  getArticleImageUrl(article: Article): string {
    return article.coverImage?.url ? this.getStrapiImageUrl(article.coverImage.url) : '';
  }

  getArticleImageAlt(article: Article): string {
    return article.coverImage?.alternativeText || article.title;
  }

  private getMockArticles(): any[] {
    return [
      {
        id: 1,
        documentId: 'article-1',
        createdAt: '2024-12-15T10:00:00Z',
        updatedAt: '2024-12-15T10:00:00Z',
        publishedAt: '2024-12-15T10:00:00Z',
        title: 'The Psychology of Player Engagement: What Keeps Gamers Coming Back',
        slug: 'psychology-player-engagement',
        summary: 'Explore the fundamental principles that keep players hooked and how to implement them in your game design. From reward systems to progression mechanics, discover the psychological triggers that make games addictive.',
        body: 'Player engagement is the holy grail of game development...'
      },
      {
        id: 2,
        documentId: 'article-2',
        createdAt: '2024-12-12T10:00:00Z',
        updatedAt: '2024-12-12T10:00:00Z',
        publishedAt: '2024-12-12T10:00:00Z',
        title: 'Building Immersive Worlds: A Designer\'s Guide',
        slug: 'building-immersive-worlds',
        summary: 'Learn the secrets behind creating compelling game worlds that players never want to leave. From environmental storytelling to world consistency.',
        body: 'World building is an essential aspect of game development...'
      },
      {
        id: 3,
        documentId: 'article-3',
        createdAt: '2024-12-10T10:00:00Z',
        updatedAt: '2024-12-10T10:00:00Z',
        publishedAt: '2024-12-10T10:00:00Z',
        title: 'The Art of Balancing Game Mechanics',
        slug: 'art-balancing-game-mechanics',
        summary: 'Discover how to create perfectly balanced gameplay that challenges without frustrating players. Essential techniques for fine-tuning difficulty curves.',
        body: 'Game balance is crucial for player satisfaction...'
      },
      {
        id: 4,
        documentId: 'article-4',
        createdAt: '2024-12-01T10:00:00Z',
        updatedAt: '2024-12-01T10:00:00Z',
        publishedAt: '2024-12-01T10:00:00Z',
        title: 'Indie Game Marketing Strategies That Actually Work',
        slug: 'indie-game-marketing-strategies',
        summary: 'Essential marketing tips for indie developers to get their games noticed in a crowded market. Proven strategies from successful indie launches.',
        body: 'Marketing an indie game requires creativity and strategy...'
      },
      {
        id: 5,
        documentId: 'article-5',
        createdAt: '2024-11-28T10:00:00Z',
        updatedAt: '2024-11-28T10:00:00Z',
        publishedAt: '2024-11-28T10:00:00Z',
        title: 'Advanced Shader Techniques for Indie Developers',
        slug: 'advanced-shader-techniques',
        summary: 'Unlock the power of custom shaders to create stunning visual effects on a budget. Step-by-step tutorials for common shader patterns.',
        body: 'Shaders can transform the visual appeal of your game...'
      },
      {
        id: 6,
        documentId: 'article-6',
        createdAt: '2024-11-25T10:00:00Z',
        updatedAt: '2024-11-25T10:00:00Z',
        publishedAt: '2024-11-25T10:00:00Z',
        title: 'Creating Memorable Characters in Games',
        slug: 'creating-memorable-characters',
        summary: 'Design principles for crafting characters that resonate with players long after they finish playing. From personality to visual design.',
        body: 'Character design goes beyond just visual appeal...'
      }
    ];
  }
}