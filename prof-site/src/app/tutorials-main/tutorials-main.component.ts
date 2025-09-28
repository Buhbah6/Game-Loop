import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tutorials-main',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tutorials-main.component.html',
  styleUrl: './tutorials-main.component.scss'
})
export class TutorialsMainComponent {
  tutorials = [
    {
      id: 1,
      title: 'Unity 2D Physics: From Basics to Advanced',
      description: 'Master Unity\'s 2D physics system with hands-on examples and best practices for creating realistic game mechanics.',
      instructor: 'Mike Chen',
      date: 'Dec 8',
      duration: '25 min',
      difficulty: 'Beginner',
      category: 'Unity',
      tags: ['Unity', 'Physics', '2D'],
      lessons: 8,
      featured: true
    },
    {
      id: 2,
      title: 'Creating Pixel Art Characters in Aseprite',
      description: 'Learn professional pixel art techniques to create memorable characters for your indie games.',
      instructor: 'Sarah Kim',
      date: 'Dec 5',
      duration: '18 min',
      difficulty: 'Intermediate',
      category: 'Art',
      tags: ['Pixel Art', 'Aseprite', 'Character Design'],
      lessons: 6
    },
    {
      id: 3,
      title: 'Game Audio Implementation with FMOD',
      description: 'Implement professional audio systems using FMOD to create immersive soundscapes.',
      instructor: 'David Rodriguez',
      date: 'Dec 3',
      duration: '22 min',
      difficulty: 'Advanced',
      category: 'Audio',
      tags: ['FMOD', 'Audio', 'Sound Design'],
      lessons: 7
    },
    {
      id: 4,
      title: 'Building AI Behavior Trees in C#',
      description: 'Create intelligent NPCs using behavior trees for complex decision-making systems.',
      instructor: 'Alex Thompson',
      date: 'Nov 30',
      duration: '35 min',
      difficulty: 'Advanced',
      category: 'Programming',
      tags: ['AI', 'C#', 'Behavior Trees'],
      lessons: 12
    },
    {
      id: 5,
      title: 'Optimizing Mobile Games for Performance',
      description: 'Essential optimization techniques to ensure smooth gameplay on mobile devices.',
      instructor: 'Lisa Zhang',
      date: 'Nov 26',
      duration: '28 min',
      difficulty: 'Intermediate',
      category: 'Optimization',
      tags: ['Mobile', 'Performance', 'Optimization'],
      lessons: 9
    },
    {
      id: 6,
      title: 'Procedural World Generation with Perlin Noise',
      description: 'Generate infinite, beautiful worlds using mathematical noise functions.',
      instructor: 'Emma Wilson',
      date: 'Nov 22',
      duration: '31 min',
      difficulty: 'Advanced',
      category: 'Programming',
      tags: ['Procedural', 'World Generation', 'Algorithms'],
      lessons: 10
    }
  ];

  categories = ['All', 'Unity', 'Programming', 'Art', 'Audio', 'Optimization'];
  difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  selectedCategory = 'All';
  selectedDifficulty = 'All';

  get filteredTutorials() {
    return this.tutorials.filter(tutorial => {
      const categoryMatch = this.selectedCategory === 'All' || 
        tutorial.category === this.selectedCategory || 
        tutorial.tags.includes(this.selectedCategory);
      const difficultyMatch = this.selectedDifficulty === 'All' || 
        tutorial.difficulty === this.selectedDifficulty;
      return categoryMatch && difficultyMatch;
    });
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
  }

  selectDifficulty(difficulty: string) {
    this.selectedDifficulty = difficulty;
  }
}