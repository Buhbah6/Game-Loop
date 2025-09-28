import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';

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

  private videosData = [
    {
      id: 1,
      title: 'Building Your First 3D Game in Unity - Complete Walkthrough',
      description: `
        <p>In this comprehensive video tutorial, we'll walk through the entire process of creating a 3D platformer game in Unity from scratch. Perfect for beginners who want to learn game development step by step.</p>
        
        <h3>What We'll Cover:</h3>
        <ul>
          <li>Setting up a new 3D Unity project</li>
          <li>Creating terrain and environment</li>
          <li>Player character controller with smooth movement</li>
          <li>Jump mechanics and physics</li>
          <li>Camera systems and controls</li>
          <li>Collectible items and scoring</li>
          <li>Basic enemy AI patterns</li>
          <li>Level design principles</li>
          <li>Polish and finishing touches</li>
        </ul>
        
        <h3>Key Learning Objectives:</h3>
        <p>By the end of this tutorial, you'll have a solid understanding of Unity's 3D development workflow and be able to create your own platformer games. We'll cover essential concepts like transform manipulation, collision detection, and component-based architecture.</p>
        
        <h3>Prerequisites:</h3>
        <p>Basic familiarity with Unity's interface is helpful but not required. We'll explain everything as we go!</p>
      `,
      creator: 'GameDev Academy',
      creatorBio: 'Leading game development education channel with over 500K subscribers.',
      duration: '45:30',
      views: '125.3K',
      likes: '8.2K',
      publishDate: 'December 20, 2024',
      category: 'Unity Tutorials',
      tags: ['Unity', '3D Game Development', 'Beginner', 'Platformer', 'Tutorial'],
      videoUrl: 'https://example.com/video1.mp4', // In real app, this would be actual video URL
      thumbnailUrl: '/assets/video-thumbnails/unity-3d-tutorial.jpg',
      chapters: [
        { title: 'Introduction & Project Setup', time: '0:00', duration: '3:20' },
        { title: 'Creating the Environment', time: '3:20', duration: '7:45' },
        { title: 'Player Character Controller', time: '11:05', duration: '12:30' },
        { title: 'Jump Mechanics', time: '23:35', duration: '6:15' },
        { title: 'Camera System', time: '29:50', duration: '5:40' },
        { title: 'Collectibles & Scoring', time: '35:30', duration: '6:30' },
        { title: 'Enemy AI Basics', time: '42:00', duration: '8:45' },
        { title: 'Level Design Tips', time: '50:45', duration: '4:30' },
        { title: 'Final Polish', time: '55:15', duration: '3:15' }
      ]
    },
    {
      id: 2,
      title: 'Advanced Shader Effects in Unreal Engine 5',
      description: `
        <p>Dive deep into Unreal Engine 5's material editor to create stunning visual effects that will make your games stand out. This advanced tutorial covers cutting-edge shader techniques used in modern AAA games.</p>
        
        <h3>Advanced Topics Covered:</h3>
        <ul>
          <li>Nanite virtualized geometry workflows</li>
          <li>Lumen global illumination integration</li>
          <li>Advanced material functions and expressions</li>
          <li>Vertex animation techniques</li>
          <li>Dynamic material parameters</li>
          <li>Performance optimization strategies</li>
        </ul>
      `,
      creator: 'UE5 Masters',
      creatorBio: 'Professional technical artists sharing advanced Unreal Engine techniques.',
      duration: '38:15',
      views: '67.8K',
      likes: '4.1K',
      publishDate: 'December 18, 2024',
      category: 'Unreal Engine',
      tags: ['Unreal Engine 5', 'Shaders', 'Materials', 'Advanced', 'Visual Effects'],
      videoUrl: 'https://example.com/video2.mp4',
      thumbnailUrl: '/assets/video-thumbnails/ue5-shaders.jpg',
      chapters: [
        { title: 'Material Editor Overview', time: '0:00', duration: '4:30' },
        { title: 'Nanite Integration', time: '4:30', duration: '8:20' },
        { title: 'Lumen Considerations', time: '12:50', duration: '6:45' },
        { title: 'Advanced Functions', time: '19:35', duration: '12:15' },
        { title: 'Vertex Animation', time: '31:50', duration: '6:25' }
      ]
    },
    {
      id: 3,
      title: 'Mobile Game Monetization Strategies That Actually Work',
      description: `
        <p>Learn proven monetization strategies from successful mobile game developers. This video breaks down different revenue models and shows you how to implement them effectively without hurting player experience.</p>
        
        <h3>Monetization Models:</h3>
        <ul>
          <li>Freemium with in-app purchases</li>
          <li>Ad-supported revenue streams</li>
          <li>Battle pass and seasonal content</li>
          <li>Cosmetic and premium currency systems</li>
        </ul>
      `,
      creator: 'Indie Business',
      creatorBio: 'Business strategy channel focused on indie game development success.',
      duration: '28:42',
      views: '89.2K',
      likes: '6.7K',
      publishDate: 'December 16, 2024',
      category: 'Business',
      tags: ['Mobile Games', 'Monetization', 'Business Strategy', 'Marketing'],
      videoUrl: 'https://example.com/video3.mp4',
      thumbnailUrl: '/assets/video-thumbnails/mobile-monetization.jpg',
      chapters: [
        { title: 'Monetization Overview', time: '0:00', duration: '5:15' },
        { title: 'IAP Best Practices', time: '5:15', duration: '8:30' },
        { title: 'Ad Integration', time: '13:45', duration: '7:20' },
        { title: 'Retention Strategies', time: '21:05', duration: '7:37' }
      ]
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadVideo(id);
    this.loadRelatedVideos(id);
  }

  private loadVideo(id: number) {
    this.video = this.videosData.find(v => v.id === id);
    if (!this.video) {
      this.router.navigate(['/videos']);
    } else {
      // Parse duration to seconds for progress calculations
      this.duration = this.parseDurationToSeconds(this.video.duration);
    }
  }

  private loadRelatedVideos(currentId: number) {
    this.relatedVideos = this.videosData
      .filter(v => v.id !== currentId)
      .slice(0, 4);
  }

  private parseDurationToSeconds(duration: string): number {
    const parts = duration.split(':');
    if (parts.length === 2) {
      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }
    return 0;
  }

  navigateToVideo(videoId: number) {
    this.router.navigate(['/videos', videoId]);
  }

  togglePlayPause() {
    this.isPlaying = !this.isPlaying;
    // In a real app, this would control actual video playback
  }

  seekToChapter(chapterTime: string) {
    // Convert time string to seconds and seek
    const parts = chapterTime.split(':');
    const seconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
    this.currentTime = seconds;
    // In a real app, this would seek the video player
  }

  likeVideo() {
    // In a real app, this would send a like request to the backend
    console.log('Liked video:', this.video.title);
  }

  shareVideo() {
    if (navigator.share) {
      navigator.share({
        title: this.video.title,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  }

  subscribeToCreator() {
    // In a real app, this would handle subscription
    console.log('Subscribed to:', this.video.creator);
  }

  getCreatorInitials(): string {
    if (!this.video || !this.video.creator) return '';
    return this.video.creator.split(' ').map((word: string) => word[0]).join('');
  }
}