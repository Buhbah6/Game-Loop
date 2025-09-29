import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { StrapiService } from '../services/strapi.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-video',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './video.component.html',
  styleUrl: './video.component.scss'
})
export class VideoComponent implements OnInit {
  video: any = null;
  relatedVideos: any[] = [];
  isPlaying = false;
  currentTime = 0;
  duration = 0;
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
      this.loadVideo(this.currentDocumentId);
    } else {
      this.error = true;
      this.loading = false;
    }
  }

  private loadVideo(documentId: string) {
    this.loading = true;
    this.error = false;
    
    this.strapiService.getVideo(documentId)
      .pipe(
        catchError(error => {
          console.error('Error loading video:', error);
          // Fallback to mock data
          const mockVideo: any = {
            id: 1,
            documentId: documentId,
            title: 'Building Your First 3D Game in Unity - Complete Walkthrough',
            summary: 'In this comprehensive video tutorial, we\'ll walk through the entire process of creating a 3D platformer game in Unity from scratch.',
            body: '<p>This is a comprehensive Unity 3D game development video that will teach you everything you need to know to create amazing 3D games.</p>',
            category: 'Unity Tutorials',
            coverImage: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            publishedAt: new Date().toISOString()
          };
          return of(mockVideo);
        })
      )
      .subscribe(response => {
        this.video = response;
        this.loading = false;
        this.duration = 45 * 60 + 30; // 45:30 in seconds
        this.loadRelatedVideos();
      });
  }

  private loadRelatedVideos() {
    this.strapiService.getVideos()
      .pipe(
        catchError(error => {
          console.error('Error loading related videos:', error);
          return of([]);
        })
      )
      .subscribe((response: any) => {
        this.relatedVideos = response
          .filter((v: any) => v.documentId !== this.currentDocumentId)
          .slice(0, 4);
      });
  }

  private parseDurationToSeconds(duration: string): number {
    const parts = duration.split(':');
    if (parts.length === 2) {
      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }
    return 0;
  }

  private formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  togglePlayback() {
    this.isPlaying = !this.isPlaying;
    // In a real app, this would control actual video playback
  }

  seekTo(time: number) {
    this.currentTime = time;
    // In a real app, this would seek the video to the specified time
  }

  getProgressPercentage(): number {
    if (this.duration === 0) return 0;
    return (this.currentTime / this.duration) * 100;
  }

  navigateToVideo(video: any) {
    this.router.navigate(['/videos', video.documentId]);
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

  getVideoImageUrl(video: any): string {
    return video.coverImage?.url ? this.getStrapiImageUrl(video.coverImage.url) : '';
  }

  getVideoImageAlt(video: any): string {
    return video.coverImage?.alternativeText || video.title || 'Video thumbnail';
  }

  getFormattedDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  shareVideo() {
    if (this.video && navigator.share) {
      navigator.share({
        title: this.video.title,
        text: this.video.summary,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  }
}