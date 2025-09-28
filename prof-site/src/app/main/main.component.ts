import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, combineLatest, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
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
  recentArticles$: Observable<Article[]>;
  latestTutorials$: Observable<Tutorial[]>;
  latestVideos$: Observable<Video[]>;
  allArticles$: Observable<Article[]>;
  allTutorials$: Observable<Tutorial[]>;
  
  // State for showing all items
  private showAllArticlesSubject = new BehaviorSubject<boolean>(false);
  private showAllTutorialsSubject = new BehaviorSubject<boolean>(false);
  
  showAllArticles$ = this.showAllArticlesSubject.asObservable();
  showAllTutorials$ = this.showAllTutorialsSubject.asObservable();

  constructor(
    private strapiService: StrapiService,
    private router: Router
  ) {
    // Load all articles
    this.allArticles$ = this.strapiService.getArticles({
      pagination: { limit: 100 } // Get more articles to show proper count
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
    
    // Load all tutorials
    this.allTutorials$ = this.strapiService.getTutorials({
      pagination: { limit: 100 } // Get more tutorials to show proper count
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

    // Featured article (first article)
    this.featuredArticle$ = this.allArticles$.pipe(
      map(articles => articles[0])
    );
    
    // Recent articles (excluding featured, with dynamic limit)
    this.recentArticles$ = combineLatest([
      this.allArticles$,
      this.showAllArticles$
    ]).pipe(
      map(([articles, showAll]) => {
        const articlesWithoutFeatured = articles.slice(1);
        return showAll ? articlesWithoutFeatured : articlesWithoutFeatured.slice(0, 6);
      })
    );
    
    // Latest tutorials (with dynamic limit)
    this.latestTutorials$ = combineLatest([
      this.allTutorials$,
      this.showAllTutorials$
    ]).pipe(
      map(([tutorials, showAll]) => {
        return showAll ? tutorials : tutorials.slice(0, 5);
      })
    );
    
    this.latestVideos$ = this.strapiService.getVideos({
      pagination: { limit: 3 }
    });
  }

  ngOnInit() {
    // Test Strapi connection
    console.log('Initializing MainComponent...');
    console.log('Strapi URL:', 'http://localhost:1337');
    
    this.strapiService.testConnection().subscribe(
      (connected) => {
        console.log('Strapi connection test:', connected ? 'SUCCESS' : 'FAILED');
        if (!connected) {
          console.log('Strapi is not available, using mock data');
        }
      }
    );

    // Subscribe to data streams to see what's happening
    this.featuredArticle$.subscribe(article => {
      console.log('Featured article updated:', article);
    });

    this.recentArticles$.subscribe(articles => {
      console.log('Recent articles updated:', articles);
    });

    this.latestTutorials$.subscribe(tutorials => {
      console.log('Latest tutorials updated:', tutorials);
    });
  }

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

  toggleShowAllArticles() {
    this.showAllArticlesSubject.next(!this.showAllArticlesSubject.value);
  }

  toggleShowAllTutorials() {
    this.showAllTutorialsSubject.next(!this.showAllTutorialsSubject.value);
  }

  get showAllArticles(): boolean {
    return this.showAllArticlesSubject.value;
  }

  get showAllTutorials(): boolean {
    return this.showAllTutorialsSubject.value;
  }

  private getMockArticles(): any[] {
    return [
      {
        id: 1,
        documentId: '1',
        title: 'Advanced Player Engagement Strategies in Modern Game Design',
        summary: 'Discover how top game studios create compelling player experiences that drive long-term engagement and retention through innovative mechanics and psychological insights.',
        publishedAt: '2024-12-15',
        readTime: '8 min read'
      },
      {
        id: 2,
        documentId: '2',
        title: 'Building Immersive Game Worlds',
        summary: 'Learn the art of world-building that captivates players and creates memorable gaming experiences.',
        publishedAt: '2024-12-14',
        readTime: '6 min read'
      },
      {
        id: 3,
        documentId: '3',
        title: 'Game Balance and Player Psychology',
        summary: 'Understanding the delicate balance between challenge and reward in game design.',
        publishedAt: '2024-12-13',
        readTime: '7 min read'
      },
      {
        id: 4,
        documentId: '4',
        title: 'Marketing Your Indie Game',
        summary: 'Effective strategies for promoting your game on a limited budget.',
        publishedAt: '2024-12-12',
        readTime: '5 min read'
      },
      {
        id: 5,
        documentId: '5',
        title: 'Advanced Programming Techniques',
        summary: 'Level up your coding skills with these advanced programming patterns.',
        publishedAt: '2024-12-11',
        readTime: '9 min read'
      },
      {
        id: 6,
        documentId: '6',
        title: 'Mobile Game Optimization',
        summary: 'Optimize your mobile games for better performance and user experience.',
        publishedAt: '2024-12-10',
        readTime: '6 min read'
      },
      {
        id: 7,
        documentId: '7',
        title: 'VR Game Development Basics',
        summary: 'Get started with virtual reality game development.',
        publishedAt: '2024-12-09',
        readTime: '11 min read'
      },
      {
        id: 8,
        documentId: '8',
        title: 'AI in Game Development',
        summary: 'Implementing artificial intelligence to enhance gameplay.',
        publishedAt: '2024-12-08',
        readTime: '8 min read'
      },
      {
        id: 9,
        documentId: '9',
        title: 'Multiplayer Networking Fundamentals',
        summary: 'Learn the basics of creating multiplayer games.',
        publishedAt: '2024-12-07',
        readTime: '10 min read'
      },
      {
        id: 10,
        documentId: '10',
        title: 'Game Monetization Strategies',
        summary: 'Effective ways to monetize your game without hurting player experience.',
        publishedAt: '2024-12-06',
        readTime: '7 min read'
      }
    ];
  }

  private getMockTutorials(): any[] {
    return [
      {
        id: 1,
        documentId: '1',
        title: 'Unity 2D Platformer Basics',
        description: 'Create your first 2D platformer with Unity\'s built-in physics system.',
        publishedAt: '2024-12-08',
        duration: '25 minutes'
      },
      {
        id: 2,
        documentId: '2',
        title: 'Pixel Art Character Design',
        description: 'Master the fundamentals of creating compelling pixel art characters.',
        publishedAt: '2024-12-07',
        duration: '22 minutes'
      },
      {
        id: 3,
        documentId: '3',
        title: 'Game Audio Implementation',
        description: 'Learn how to implement dynamic audio systems in your games.',
        publishedAt: '2024-12-06',
        duration: '19 minutes'
      },
      {
        id: 4,
        documentId: '4',
        title: 'AI Behavior Trees',
        description: 'Implement intelligent NPC behavior using behavior trees.',
        publishedAt: '2024-12-05',
        duration: '28 minutes'
      },
      {
        id: 5,
        documentId: '5',
        title: 'Mobile Touch Controls',
        description: 'Design intuitive touch controls for mobile games.',
        publishedAt: '2024-12-04',
        duration: '16 minutes'
      },
      {
        id: 6,
        documentId: '6',
        title: 'Shader Programming Introduction',
        description: 'Get started with custom shaders for visual effects.',
        publishedAt: '2024-12-03',
        duration: '32 minutes'
      },
      {
        id: 7,
        documentId: '7',
        title: 'Game Performance Optimization',
        description: 'Optimize your game for better frame rates and memory usage.',
        publishedAt: '2024-12-02',
        duration: '24 minutes'
      },
      {
        id: 8,
        documentId: '8',
        title: 'Level Design Principles',
        description: 'Create engaging and balanced game levels.',
        publishedAt: '2024-12-01',
        duration: '21 minutes'
      }
    ];
  }
}