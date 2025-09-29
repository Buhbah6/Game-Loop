import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable, BehaviorSubject, combineLatest, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { StrapiService } from '../services/strapi.service';
import { Tutorial } from '../interfaces/strapi.interface';

@Component({
  selector: 'app-tutorials-main',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tutorials-main.component.html',
  styleUrl: './tutorials-main.component.scss'
})
export class TutorialsMainComponent implements OnInit {
  allTutorials$: Observable<Tutorial[]>;
  filteredTutorials$: Observable<Tutorial[]>;
  
  // State for filtering
  private selectedCategorySubject = new BehaviorSubject<string>('All');
  private selectedDifficultySubject = new BehaviorSubject<string>('All');
  selectedCategory$ = this.selectedCategorySubject.asObservable();
  selectedDifficulty$ = this.selectedDifficultySubject.asObservable();

  categories = ['All', 'Unity', 'Programming', 'Art', 'Audio', 'Optimization'];
  difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  selectedCategory = 'All';
  selectedDifficulty = 'All';

  constructor(
    private strapiService: StrapiService,
    private router: Router
  ) {
    // Load all tutorials from Strapi
    this.allTutorials$ = this.strapiService.getTutorials({
      pagination: { limit: 100 }
    }).pipe(
      map(tutorials => {
        console.log('Tutorials loaded:', tutorials);
        // If no tutorials from Strapi or empty array, use mock data
        if (!tutorials || tutorials.length === 0) {
          console.log('No tutorials from Strapi, using mock data');
          return this.getMockTutorials() as Tutorial[];
        }
        return tutorials;
      }),
      catchError(() => {
        console.log('Error loading tutorials, using mock data');
        return of(this.getMockTutorials() as Tutorial[]);
      })
    );

    // Filter tutorials based on selected category and difficulty
    this.filteredTutorials$ = combineLatest([
      this.allTutorials$,
      this.selectedCategory$,
      this.selectedDifficulty$
    ]).pipe(
      map(([tutorials, category, difficulty]) => {
        let filtered = tutorials;
        
        // Filter by category (using title content for now)
        if (category !== 'All') {
          filtered = filtered.filter(tutorial => 
            tutorial.title.toLowerCase().includes(category.toLowerCase()) ||
            tutorial.description?.toLowerCase().includes(category.toLowerCase())
          );
        }
        
        // For difficulty, we'll use a simple mapping based on tutorial complexity indicated in title
        if (difficulty !== 'All') {
          filtered = filtered.filter(tutorial => {
            const title = tutorial.title.toLowerCase();
            if (difficulty === 'Beginner' && (title.includes('basic') || title.includes('intro'))) return true;
            if (difficulty === 'Intermediate' && title.includes('intermediate')) return true;
            if (difficulty === 'Advanced' && title.includes('advanced')) return true;
            return difficulty === 'Beginner'; // Default to beginner if no specific difficulty indicator
          });
        }
        
        return filtered;
      })
    );
  }

  ngOnInit() {
    console.log('TutorialsMainComponent initialized');
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.selectedCategorySubject.next(category);
  }

  selectDifficulty(difficulty: string) {
    this.selectedDifficulty = difficulty;
    this.selectedDifficultySubject.next(difficulty);
  }

  navigateToTutorial(tutorial: Tutorial) {
    this.router.navigate(['/tutorials', tutorial.documentId]);
  }

  getFormattedDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  }

  getDifficultyFromTitle(title: string): string {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('advanced')) return 'Advanced';
    if (lowerTitle.includes('intermediate')) return 'Intermediate';
    if (lowerTitle.includes('basic') || lowerTitle.includes('intro')) return 'Beginner';
    return 'Beginner';
  }

  getCategoryFromTitle(title: string): string {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('unity')) return 'Unity';
    if (lowerTitle.includes('programming') || lowerTitle.includes('c#') || lowerTitle.includes('code')) return 'Programming';
    if (lowerTitle.includes('art') || lowerTitle.includes('pixel')) return 'Art';
    if (lowerTitle.includes('audio') || lowerTitle.includes('sound')) return 'Audio';
    if (lowerTitle.includes('optimization') || lowerTitle.includes('performance')) return 'Optimization';
    return 'General';
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

  getTutorialImageUrl(tutorial: Tutorial): string {
    if (tutorial.coverImage && tutorial.coverImage.length > 0 && tutorial.coverImage[0].url) {
      return this.getStrapiImageUrl(tutorial.coverImage[0].url);
    }
    return '';
  }

  getTutorialImageAlt(tutorial: Tutorial): string {
    if (tutorial.coverImage && tutorial.coverImage.length > 0) {
      return tutorial.coverImage[0].alternativeText || tutorial.title;
    }
    return tutorial.title;
  }

  private getMockTutorials(): any[] {
    return [
      {
        id: 1,
        documentId: 'tutorial-1',
        createdAt: '2024-12-08T10:00:00Z',
        updatedAt: '2024-12-08T10:00:00Z',
        publishedAt: '2024-12-08T10:00:00Z',
        title: 'Unity 2D Physics: From Basics to Advanced',
        slug: 'unity-2d-physics-basics-advanced',
        description: 'Master Unity\'s 2D physics system with hands-on examples and best practices for creating realistic game mechanics.',
        body: 'This comprehensive tutorial covers Unity 2D physics...'
      },
      {
        id: 2,
        documentId: 'tutorial-2',
        createdAt: '2024-12-05T10:00:00Z',
        updatedAt: '2024-12-05T10:00:00Z',
        publishedAt: '2024-12-05T10:00:00Z',
        title: 'Creating Pixel Art Characters in Aseprite',
        slug: 'creating-pixel-art-characters-aseprite',
        description: 'Learn professional pixel art techniques to create memorable characters for your indie games.',
        body: 'Pixel art character creation tutorial content...'
      },
      {
        id: 3,
        documentId: 'tutorial-3',
        createdAt: '2024-12-03T10:00:00Z',
        updatedAt: '2024-12-03T10:00:00Z',
        publishedAt: '2024-12-03T10:00:00Z',
        title: 'Game Audio Implementation with FMOD',
        slug: 'game-audio-implementation-fmod',
        description: 'Implement professional audio systems using FMOD to create immersive soundscapes.',
        body: 'Game audio implementation tutorial content...'
      },
      {
        id: 4,
        documentId: 'tutorial-4',
        createdAt: '2024-11-30T10:00:00Z',
        updatedAt: '2024-11-30T10:00:00Z',
        publishedAt: '2024-11-30T10:00:00Z',
        title: 'Building AI Behavior Trees in C# - Advanced Programming',
        slug: 'building-ai-behavior-trees-csharp',
        description: 'Create intelligent NPCs using behavior trees for complex decision-making systems.',
        body: 'AI behavior trees tutorial content...'
      },
      {
        id: 5,
        documentId: 'tutorial-5',
        createdAt: '2024-11-26T10:00:00Z',
        updatedAt: '2024-11-26T10:00:00Z',
        publishedAt: '2024-11-26T10:00:00Z',
        title: 'Optimizing Mobile Games for Performance',
        slug: 'optimizing-mobile-games-performance',
        description: 'Essential optimization techniques to ensure smooth gameplay on mobile devices.',
        body: 'Mobile game optimization tutorial content...'
      },
      {
        id: 6,
        documentId: 'tutorial-6',
        createdAt: '2024-11-22T10:00:00Z',
        updatedAt: '2024-11-22T10:00:00Z',
        publishedAt: '2024-11-22T10:00:00Z',
        title: 'Procedural World Generation with Programming Algorithms - Advanced',
        slug: 'procedural-world-generation-algorithms',
        description: 'Generate infinite, beautiful worlds using mathematical noise functions.',
        body: 'Procedural world generation tutorial content...'
      }
    ];
  }
}