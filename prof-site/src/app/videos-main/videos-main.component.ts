import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-videos-main',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './videos-main.component.html',
  styleUrl: './videos-main.component.scss'
})
export class VideosMainComponent {
  videos = [
    {
      id: 1,
      title: 'Complete Unity 3D RPG Development Course',
      description: 'Build a complete RPG from scratch with Unity 3D. Learn character systems, combat, inventory, and more.',
      creator: 'GameDev Academy',
      uploadDate: 'Dec 10',
      duration: '4:32:15',
      views: '125K',
      category: 'Unity',
      tags: ['Unity', 'RPG', 'Complete Course'],
      featured: true,
      thumbnail: 'rpg-course.jpg'
    },
    {
      id: 2,
      title: 'Advanced Lighting Techniques in Unreal Engine 5',
      description: 'Master UE5 lighting with Lumen and advanced rendering techniques for photorealistic games.',
      creator: 'VFX Master',
      uploadDate: 'Dec 8',
      duration: '45:22',
      views: '89K',
      category: 'Unreal Engine',
      tags: ['Unreal Engine', 'Lighting', 'Graphics'],
      thumbnail: 'lighting-ue5.jpg'
    },
    {
      id: 3,
      title: 'Procedural Animation in Unity with Timeline',
      description: 'Create dynamic procedural animations using Unity\'s Timeline system and Cinemachine.',
      creator: 'Animation Pro',
      uploadDate: 'Dec 5',
      duration: '38:45',
      views: '67K',
      category: 'Animation',
      tags: ['Unity', 'Animation', 'Timeline'],
      thumbnail: 'animation-unity.jpg'
    },
    {
      id: 4,
      title: 'Indie Game Publishing: From Concept to Steam',
      description: 'Complete guide to publishing your indie game on Steam, including marketing and community building.',
      creator: 'Indie Success',
      uploadDate: 'Dec 3',
      duration: '1:15:30',
      views: '156K',
      category: 'Business',
      tags: ['Publishing', 'Steam', 'Marketing'],
      thumbnail: 'steam-publishing.jpg'
    },
    {
      id: 5,
      title: 'AI Pathfinding Algorithms Explained',
      description: 'Deep dive into A*, Dijkstra, and other pathfinding algorithms for game AI development.',
      creator: 'Code Wizard',
      uploadDate: 'Nov 28',
      duration: '52:18',
      views: '94K',
      category: 'Programming',
      tags: ['AI', 'Algorithms', 'Pathfinding'],
      thumbnail: 'ai-pathfinding.jpg'
    },
    {
      id: 6,
      title: 'Creating Stunning VFX with Particle Systems',
      description: 'Master particle systems to create fire, explosions, magic effects, and environmental VFX.',
      creator: 'VFX Artist',
      uploadDate: 'Nov 25',
      duration: '29:43',
      views: '112K',
      category: 'VFX',
      tags: ['VFX', 'Particles', 'Effects'],
      thumbnail: 'particle-vfx.jpg'
    }
  ];

  categories = ['All', 'Unity', 'Unreal Engine', 'Programming', 'Animation', 'VFX', 'Business'];
  selectedCategory = 'All';

  get filteredVideos() {
    if (this.selectedCategory === 'All') {
      return this.videos;
    }
    return this.videos.filter(video => 
      video.category === this.selectedCategory || 
      video.tags.includes(this.selectedCategory)
    );
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
  }

  formatDuration(duration: string): string {
    return duration;
  }

  formatViews(views: string): string {
    return views + ' views';
  }
}