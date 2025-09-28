import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  teamMembers = [
    {
      name: 'Sarah Chen',
      role: 'Lead Game Designer',
      bio: '10+ years in AAA game development. Former Blizzard and Riot Games designer.',
      expertise: ['Game Design', 'Player Psychology', 'Systems Design'],
      image: 'sarah-chen.jpg'
    },
    {
      name: 'Mike Rodriguez',
      role: 'Senior Unity Developer',
      bio: 'Unity expert with 8 years of experience building mobile and PC games.',
      expertise: ['Unity 3D', 'C# Programming', 'Mobile Optimization'],
      image: 'mike-rodriguez.jpg'
    },
    {
      name: 'Emma Wilson',
      role: 'Technical Artist',
      bio: 'Bridge between art and code. Specialist in shaders and rendering pipelines.',
      expertise: ['Shaders', 'VFX', 'Pipeline Development'],
      image: 'emma-wilson.jpg'
    },
    {
      name: 'David Kim',
      role: 'Community Manager',
      bio: 'Building and nurturing the game development community for 5+ years.',
      expertise: ['Community Building', 'Content Strategy', 'Developer Relations'],
      image: 'david-kim.jpg'
    }
  ];

  stats = [
    { label: 'Articles Published', value: '150+', icon: '📝' },
    { label: 'Video Tutorials', value: '80+', icon: '🎬' },
    { label: 'Community Members', value: '25K+', icon: '👥' },
    { label: 'Years of Experience', value: '5+', icon: '⭐' }
  ];
}