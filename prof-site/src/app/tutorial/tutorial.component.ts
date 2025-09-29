import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { StrapiService } from '../services/strapi.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-tutorial',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tutorial.component.html',
  styleUrl: './tutorial.component.scss'
})
export class TutorialComponent implements OnInit {
  tutorial: any = null;
  relatedTutorials: any[] = [];
  currentChapter = 0;
  loading = true;
  error = false;
  currentDocumentId: string | null = null;



  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private strapiService: StrapiService
  ) {}

  ngOnInit() {
    this.currentDocumentId = this.route.snapshot.paramMap.get('documentId');
    if (this.currentDocumentId) {
      this.loadTutorial(this.currentDocumentId);
    } else {
      this.error = true;
      this.loading = false;
    }
  }

  private loadTutorial(documentId: string) {
    this.loading = true;
    this.error = false;
    
    this.strapiService.getTutorial(documentId)
      .pipe(
        catchError(error => {
          console.error('Error loading tutorial:', error);
          // Fallback to mock data
          const mockTutorial: any = {
            id: 1,
            documentId: documentId,
            title: 'Unity 2D Game Development Masterclass',
            summary: 'Learn to create complete 2D games in Unity from scratch. This comprehensive tutorial covers everything from basic concepts to advanced game mechanics.',
            body: '<p>This is a comprehensive Unity 2D game development tutorial that will teach you everything you need to know to create amazing 2D games.</p>',
            category: 'Unity',
            difficulty: 'Beginner',
            coverImage: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            publishedAt: new Date().toISOString()
          };
          return of(mockTutorial);
        })
      )
      .subscribe(response => {
        this.tutorial = response;
        this.loading = false;
        this.loadRelatedTutorials();
      });
  }

  private loadRelatedTutorials() {
    this.strapiService.getTutorials()
      .pipe(
        catchError(error => {
          console.error('Error loading related tutorials:', error);
          return of([]);
        })
      )
      .subscribe((response: any) => {
        this.relatedTutorials = response
          .filter((t: any) => t.documentId !== this.currentDocumentId)
          .slice(0, 3);
      });
  }

  navigateToTutorial(tutorial: any) {
    this.router.navigate(['/tutorials', tutorial.documentId]);
  }

  getStrapiImageUrl(url: string): string {
    if (!url) return '';
    
    // If URL is already absolute, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // Otherwise, prepend the Strapi base URL
    const baseUrl = 'http://localhost:1337';
    return url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`;
  }

  getTutorialImageUrl(tutorial: any): string {
    return tutorial.coverImage?.url ? this.getStrapiImageUrl(tutorial.coverImage.url) : '';
  }

  getTutorialImageAlt(tutorial: any): string {
    return tutorial.coverImage?.alternativeText || tutorial.title || 'Tutorial image';
  }

  getFormattedDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  shareTutorial() {
    if (this.tutorial && navigator.share) {
      navigator.share({
        title: this.tutorial.title,
        text: this.tutorial.summary,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  }

  startTutorial() {
    // In a real app, this would navigate to the video player or mark as started
    console.log('Starting tutorial:', this.tutorial.title);
  }

  toggleChapterComplete(chapterIndex: number) {
    if (this.tutorial && this.tutorial.chapters[chapterIndex]) {
      this.tutorial.chapters[chapterIndex].completed = !this.tutorial.chapters[chapterIndex].completed;
    }
  }

  getCompletionPercentage(): number {
    if (!this.tutorial || !this.tutorial.chapters) return 0;
    const completed = this.tutorial.chapters.filter((chapter: any) => chapter.completed).length;
    return Math.round((completed / this.tutorial.chapters.length) * 100);
  }

  getDifficultyColor(): string {
    if (!this.tutorial) return '#6b7280';
    switch (this.tutorial.difficulty.toLowerCase()) {
      case 'beginner': return '#10b981';
      case 'intermediate': return '#f59e0b';
      case 'advanced': return '#ef4444';
      default: return '#6b7280';
    }
  }
}