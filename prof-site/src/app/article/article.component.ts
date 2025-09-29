import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Observable, of, catchError } from 'rxjs';
import { StrapiService } from '../services/strapi.service';
import { Article } from '../interfaces/strapi.interface';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss'
})
export class ArticleComponent implements OnInit {
  article: Article | null = null;
  relatedArticles: Article[] = [];
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private strapiService: StrapiService
  ) {}

  ngOnInit() {
    const documentId = this.route.snapshot.paramMap.get('documentId');
    if (documentId) {
      this.loadArticle(documentId);
      this.loadRelatedArticles();
    } else {
      this.router.navigate(['/articles']);
    }
  }

  private loadArticle(documentId: string) {
    this.loading = true;
    this.error = false;
    
    console.log('Loading article with documentId:', documentId);
    
    this.strapiService.getArticle(documentId)
      .pipe(
        catchError((error) => {
          console.error('Error loading article from Strapi:', error);
          console.log('Using fallback mock data');
          return of(this.getMockArticle(documentId));
        })
      )
      .subscribe({
        next: (article) => {
          console.log('Article loaded:', article);
          if (article) {
            this.article = article;
            this.loading = false;
          } else {
            this.error = true;
            this.loading = false;
          }
        },
        error: (error) => {
          console.error('Subscription error:', error);
          this.error = true;
          this.loading = false;
        }
      });
  }

  private loadRelatedArticles() {
    this.strapiService.getArticles({
      pagination: { limit: 3 }
    })
    .pipe(
      catchError(() => {
        console.log('Error loading related articles, using fallback');
        return of(this.getMockArticles());
      })
    )
    .subscribe({
      next: (articles) => {
        // Filter out current article if it's in the list
        this.relatedArticles = articles.filter(a => a.documentId !== this.article?.documentId).slice(0, 3);
      },
      error: (err) => {
        console.error('Error loading related articles:', err);
        this.relatedArticles = [];
      }
    });
  }

  navigateToArticle(article: Article) {
    this.router.navigate(['/articles', article.documentId]);
  }

  shareArticle() {
    if (navigator.share) {
      navigator.share({
        title: this.article?.title,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  }

  getFormattedDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  }

  getStrapiImageUrl(url: string): string {
    if (!url) return '';
    if (url.startsWith('http')) {
      return url;
    }
    return `http://localhost:1337${url}`;
  }

  getArticleImageUrl(article: Article): string {
    return article.coverImage?.url ? this.getStrapiImageUrl(article.coverImage.url) : '';
  }

  getArticleImageAlt(article: Article): string {
    return article.coverImage?.alternativeText || article.title;
  }

  private getMockArticle(documentId: string): Article {
    return {
      id: 1,
      documentId: documentId,
      createdAt: '2024-12-15T10:00:00Z',
      updatedAt: '2024-12-15T10:00:00Z',
      publishedAt: '2024-12-15T10:00:00Z',
      title: 'Sample Article',
      slug: 'sample-article',
      summary: 'This is a sample article loaded as fallback when Strapi is not available.',
      body: '<p>This article content would normally come from Strapi, but is currently showing fallback content.</p><h2>Game Development Insights</h2><p>Learn about the latest trends and techniques in modern game development.</p>'
    };
  }

  private getMockArticles(): Article[] {
    return [
      {
        id: 2,
        documentId: 'mock-2',
        createdAt: '2024-12-14T10:00:00Z',
        updatedAt: '2024-12-14T10:00:00Z',
        publishedAt: '2024-12-14T10:00:00Z',
        title: 'Related Article 1',
        slug: 'related-article-1',
        summary: 'Another interesting article about game development.',
        body: '<p>Related content...</p>'
      },
      {
        id: 3,
        documentId: 'mock-3', 
        createdAt: '2024-12-13T10:00:00Z',
        updatedAt: '2024-12-13T10:00:00Z',
        publishedAt: '2024-12-13T10:00:00Z',
        title: 'Related Article 2',
        slug: 'related-article-2',
        summary: 'Yet another fascinating game development topic.',
        body: '<p>More related content...</p>'
      }
    ];
  }
}