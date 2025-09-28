import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-articles-main',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './articles-main.component.html',
  styleUrl: './articles-main.component.scss'
})
export class ArticlesMainComponent {
  articles = [
    {
      id: 1,
      title: 'The Psychology of Player Engagement: What Keeps Gamers Coming Back',
      excerpt: 'Explore the fundamental principles that keep players hooked and how to implement them in your game design. From reward systems to progression mechanics, discover the psychological triggers that make games addictive.',
      author: 'Sarah Chen',
      date: 'Dec 15',
      readTime: '8 min',
      category: 'Game Design',
      tags: ['Psychology', 'Player Engagement', 'Game Design'],
      featured: true
    },
    {
      id: 2,
      title: 'Building Immersive Worlds: A Designer\'s Guide',
      excerpt: 'Learn the secrets behind creating compelling game worlds that players never want to leave. From environmental storytelling to world consistency.',
      author: 'Marcus Rodriguez',
      date: 'Dec 12',
      readTime: '12 min',
      category: 'World Building',
      tags: ['World Building', 'Environment Design', 'Storytelling']
    },
    {
      id: 3,
      title: 'The Art of Balancing Game Mechanics',
      excerpt: 'Discover how to create perfectly balanced gameplay that challenges without frustrating players. Essential techniques for fine-tuning difficulty curves.',
      author: 'Alex Thompson',
      date: 'Dec 10',
      readTime: '6 min',
      category: 'Game Balance',
      tags: ['Game Balance', 'Mechanics', 'Difficulty']
    },
    {
      id: 4,
      title: 'Indie Game Marketing Strategies That Actually Work',
      excerpt: 'Essential marketing tips for indie developers to get their games noticed in a crowded market. Proven strategies from successful indie launches.',
      author: 'Emma Wilson',
      date: 'Dec 1',
      readTime: '15 min',
      category: 'Marketing',
      tags: ['Marketing', 'Indie Games', 'Business']
    },
    {
      id: 5,
      title: 'Advanced Shader Techniques for Indie Developers',
      excerpt: 'Unlock the power of custom shaders to create stunning visual effects on a budget. Step-by-step tutorials for common shader patterns.',
      author: 'David Kim',
      date: 'Nov 28',
      readTime: '20 min',
      category: 'Programming',
      tags: ['Shaders', 'Graphics', 'Programming']
    },
    {
      id: 6,
      title: 'Creating Memorable Characters in Games',
      excerpt: 'Design principles for crafting characters that resonate with players long after they finish playing. From personality to visual design.',
      author: 'Lisa Zhang',
      date: 'Nov 25',
      readTime: '10 min',
      category: 'Character Design',
      tags: ['Character Design', 'Storytelling', 'Art']
    }
  ];

  categories = ['All', 'Game Design', 'Programming', 'Art', 'Marketing', 'Business'];
  selectedCategory = 'All';

  get filteredArticles() {
    if (this.selectedCategory === 'All') {
      return this.articles;
    }
    return this.articles.filter(article => 
      article.category === this.selectedCategory || 
      article.tags.includes(this.selectedCategory)
    );
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
  }
}