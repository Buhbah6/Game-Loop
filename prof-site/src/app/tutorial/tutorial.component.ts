import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';

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

  private tutorialsData = [
    {
      id: 1,
      title: 'Unity 2D Game Development Masterclass',
      description: 'Learn to create complete 2D games in Unity from scratch. This comprehensive tutorial covers everything from basic concepts to advanced game mechanics.',
      instructor: 'David Park',
      instructorBio: 'Senior Unity Developer with 8+ years of experience at indie and AAA studios.',
      instructorAvatar: 'DP',
      duration: '4h 30m',
      difficulty: 'Beginner',
      category: 'Unity',
      publishDate: 'December 18, 2024',
      views: '15.2K',
      likes: '1.2K',
      rating: 4.8,
      totalRatings: 324,
      tags: ['Unity', '2D Games', 'C#', 'Game Development'],
      chapters: [
        {
          title: 'Introduction to Unity 2D',
          duration: '15:30',
          description: 'Overview of Unity 2D development environment and basic concepts.',
          completed: false
        },
        {
          title: 'Setting Up Your Project',
          duration: '12:45',
          description: 'Project setup, importing assets, and organizing your workspace.',
          completed: false
        },
        {
          title: 'Player Movement and Controls',
          duration: '22:15',
          description: 'Implementing smooth player movement with input handling.',
          completed: false
        },
        {
          title: 'Camera System',
          duration: '18:20',
          description: 'Creating a dynamic camera that follows the player smoothly.',
          completed: false
        },
        {
          title: 'Collision Detection',
          duration: '25:40',
          description: 'Understanding Unity\'s 2D physics and collision systems.',
          completed: false
        },
        {
          title: 'Enemy AI Basics',
          duration: '32:10',
          description: 'Creating intelligent enemy behavior with state machines.',
          completed: false
        },
        {
          title: 'UI and Menus',
          duration: '28:30',
          description: 'Designing game UI, menus, and heads-up displays.',
          completed: false
        },
        {
          title: 'Audio Integration',
          duration: '16:45',
          description: 'Adding sound effects and background music to your game.',
          completed: false
        },
        {
          title: 'Level Design',
          duration: '35:20',
          description: 'Creating engaging levels with Unity\'s tilemap system.',
          completed: false
        },
        {
          title: 'Polish and Publishing',
          duration: '19:15',
          description: 'Final touches, optimization, and publishing your game.',
          completed: false
        }
      ],
      whatYouLearn: [
        'Complete Unity 2D game development workflow',
        'C# programming for game development',
        'Player movement and physics implementation',
        'Enemy AI and behavior systems',
        'Level design and tilemap usage',
        'UI/UX design for games',
        'Audio integration and sound design',
        'Game optimization techniques',
        'Publishing to multiple platforms'
      ],
      requirements: [
        'Basic programming knowledge (any language)',
        'Computer with Unity 2022.3 LTS or newer',
        'At least 4GB of RAM',
        'Willingness to learn and experiment'
      ]
    },
    {
      id: 2,
      title: 'Advanced Shader Programming in Unity',
      description: 'Master the art of shader programming to create stunning visual effects for your games.',
      instructor: 'Elena Rodriguez',
      instructorBio: 'Technical Artist specializing in real-time graphics and shader development.',
      instructorAvatar: 'ER',
      duration: '6h 15m',
      difficulty: 'Advanced',
      category: 'Graphics',
      publishDate: 'December 15, 2024',
      views: '8.7K',
      likes: '892',
      rating: 4.9,
      totalRatings: 156,
      tags: ['Shaders', 'HLSL', 'Graphics Programming', 'Unity'],
      chapters: [
        { title: 'Shader Fundamentals', duration: '20:15', description: 'Understanding the graphics pipeline and shader basics.', completed: false },
        { title: 'Vertex Shaders', duration: '25:30', description: 'Manipulating vertices for deformation and animation.', completed: false },
        { title: 'Fragment Shaders', duration: '30:45', description: 'Creating stunning pixel-level effects.', completed: false },
        { title: 'Lighting Models', duration: '28:20', description: 'Implementing custom lighting calculations.', completed: false },
        { title: 'Post-Processing Effects', duration: '35:25', description: 'Screen-space effects and image filters.', completed: false }
      ],
      whatYouLearn: [
        'HLSL programming language',
        'Graphics pipeline understanding',
        'Custom lighting models',
        'Post-processing effects',
        'Performance optimization'
      ],
      requirements: [
        'Solid Unity experience',
        'Basic math knowledge (vectors, matrices)',
        'Understanding of 3D graphics concepts'
      ]
    },
    {
      id: 3,
      title: 'Complete C# Programming for Games',
      description: 'Master C# programming specifically for game development with practical examples and projects.',
      instructor: 'Michael Chen',
      instructorBio: 'Software Engineer and game development instructor with 10+ years of experience.',
      instructorAvatar: 'MC',
      duration: '8h 45m',
      difficulty: 'Intermediate',
      category: 'Programming',
      publishDate: 'December 12, 2024',
      views: '22.1K',
      likes: '2.1K',
      rating: 4.7,
      totalRatings: 567,
      tags: ['C#', 'Programming', 'Object-Oriented', 'Game Logic'],
      chapters: [
        { title: 'C# Fundamentals', duration: '45:30', description: 'Variables, data types, and control structures.', completed: false },
        { title: 'Object-Oriented Programming', duration: '52:15', description: 'Classes, inheritance, and polymorphism.', completed: false },
        { title: 'Collections and LINQ', duration: '38:20', description: 'Working with lists, arrays, and data queries.', completed: false },
        { title: 'Game Design Patterns', duration: '41:45', description: 'Singleton, Observer, and State patterns.', completed: false },
        { title: 'Event Systems', duration: '35:10', description: 'Creating flexible event-driven architectures.', completed: false }
      ],
      whatYouLearn: [
        'Advanced C# programming',
        'Object-oriented design principles',
        'Common game design patterns',
        'Event-driven programming',
        'Code organization and architecture'
      ],
      requirements: [
        'Basic programming experience',
        'Visual Studio or VS Code',
        'Desire to learn game development'
      ]
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadTutorial(id);
    this.loadRelatedTutorials(id);
  }

  private loadTutorial(id: number) {
    this.tutorial = this.tutorialsData.find(t => t.id === id);
    if (!this.tutorial) {
      this.router.navigate(['/tutorials']);
    }
  }

  private loadRelatedTutorials(currentId: number) {
    this.relatedTutorials = this.tutorialsData
      .filter(t => t.id !== currentId)
      .slice(0, 3);
  }

  navigateToTutorial(tutorialId: number) {
    this.router.navigate(['/tutorials', tutorialId]);
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