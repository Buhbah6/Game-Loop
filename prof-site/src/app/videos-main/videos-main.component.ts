import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable, BehaviorSubject, combineLatest, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { StrapiService } from '../services/strapi.service';
import { Video } from '../interfaces/strapi.interface';

@Component({
  selector: 'app-videos-main',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './videos-main.component.html',
  styleUrl: './videos-main.component.scss'
})
export class VideosMainComponent implements OnInit {
  allVideos$: Observable<Video[]>;
  filteredVideos$: Observable<Video[]>;
  
  // State for filtering
  private selectedCategorySubject = new BehaviorSubject<string>('All');
  selectedCategory$ = this.selectedCategorySubject.asObservable();

  categories = ['All', 'Unity', 'Unreal Engine', 'Programming', 'Animation', 'VFX', 'Business'];
  selectedCategory = 'All';

  constructor(
    private strapiService: StrapiService,
    private router: Router
  ) {
    // Load all videos from Strapi
    this.allVideos$ = this.strapiService.getVideos({
      pagination: { limit: 100 }
    }).pipe(
      map(videos => {
        console.log('Videos loaded:', videos);
        // If no videos from Strapi or empty array, use mock data
        if (!videos || videos.length === 0) {
          console.log('No videos from Strapi, using mock data');
          return this.getMockVideos() as Video[];
        }
        return videos;
      }),
      catchError(() => {
        console.log('Error loading videos, using mock data');
        return of(this.getMockVideos() as Video[]);
      })
    );

    // Filter videos based on selected category
    this.filteredVideos$ = combineLatest([
      this.allVideos$,
      this.selectedCategory$
    ]).pipe(
      map(([videos, category]) => {
        if (category === 'All') {
          return videos;
        }
        // Filter by title content since Strapi videos may not have category field
        return videos.filter(video => 
          video.title.toLowerCase().includes(category.toLowerCase())
        );
      })
    );
  }

  ngOnInit() {
    console.log('VideosMainComponent initialized');
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.selectedCategorySubject.next(category);
  }

  navigateToVideo(video: Video) {
    this.router.navigate(['/videos', video.documentId]);
  }

  getFormattedDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  }

  getCategoryFromTitle(title: string): string {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('unity')) return 'Unity';
    if (lowerTitle.includes('unreal')) return 'Unreal Engine';
    if (lowerTitle.includes('programming') || lowerTitle.includes('ai') || lowerTitle.includes('algorithm')) return 'Programming';
    if (lowerTitle.includes('animation')) return 'Animation';
    if (lowerTitle.includes('vfx') || lowerTitle.includes('particle')) return 'VFX';
    if (lowerTitle.includes('business') || lowerTitle.includes('publishing') || lowerTitle.includes('steam')) return 'Business';
    return 'General';
  }

  formatDuration(duration: string): string {
    return duration || '30:00';
  }

  formatViews(views: string): string {
    return (views || '1K') + ' views';
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

  getVideoImageUrl(video: Video): string {
    if (video.thumbnail?.data?.url) {
      return this.getStrapiImageUrl(video.thumbnail.data.url);
    }
    return '';
  }

  getVideoImageAlt(video: Video): string {
    return video.thumbnail?.data?.alternativeText || video.title;
  }

  private getMockVideos(): any[] {
    return [
      {
        id: 1,
        documentId: 'video-1',
        createdAt: '2024-12-10T10:00:00Z',
        updatedAt: '2024-12-10T10:00:00Z',
        publishedAt: '2024-12-10T10:00:00Z',
        title: 'Complete Unity 3D RPG Development Course',
        youtubeURL: 'https://www.youtube.com/watch?v=example1'
      },
      {
        id: 2,
        documentId: 'video-2',
        createdAt: '2024-12-08T10:00:00Z',
        updatedAt: '2024-12-08T10:00:00Z',
        publishedAt: '2024-12-08T10:00:00Z',
        title: 'Advanced Lighting Techniques in Unreal Engine 5',
        youtubeURL: 'https://www.youtube.com/watch?v=example2'
      },
      {
        id: 3,
        documentId: 'video-3',
        createdAt: '2024-12-05T10:00:00Z',
        updatedAt: '2024-12-05T10:00:00Z',
        publishedAt: '2024-12-05T10:00:00Z',
        title: 'Procedural Animation in Unity with Timeline',
        youtubeURL: 'https://www.youtube.com/watch?v=example3'
      },
      {
        id: 4,
        documentId: 'video-4',
        createdAt: '2024-12-03T10:00:00Z',
        updatedAt: '2024-12-03T10:00:00Z',
        publishedAt: '2024-12-03T10:00:00Z',
        title: 'Indie Game Publishing: From Concept to Steam Business Guide',
        youtubeURL: 'https://www.youtube.com/watch?v=example4'
      },
      {
        id: 5,
        documentId: 'video-5',
        createdAt: '2024-11-28T10:00:00Z',
        updatedAt: '2024-11-28T10:00:00Z',
        publishedAt: '2024-11-28T10:00:00Z',
        title: 'AI Pathfinding Programming Algorithms Explained',
        youtubeURL: 'https://www.youtube.com/watch?v=example5'
      },
      {
        id: 6,
        documentId: 'video-6',
        createdAt: '2024-11-25T10:00:00Z',
        updatedAt: '2024-11-25T10:00:00Z',
        publishedAt: '2024-11-25T10:00:00Z',
        title: 'Creating Stunning VFX with Particle Systems',
        youtubeURL: 'https://www.youtube.com/watch?v=example6'
      }
    ];
  }
}