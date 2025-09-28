import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss'
})
export class ArticleComponent implements OnInit {
  article: any = null;
  relatedArticles: any[] = [];

  // Sample articles data (in a real app, this would come from a service)
  private articlesData = [
    {
      id: 1,
      title: 'The Psychology of Player Engagement: What Keeps Gamers Coming Back',
      content: `
        <p>Player engagement is the holy grail of game development. Understanding what keeps players coming back is crucial for creating successful games that build lasting communities.</p>
        
        <h2>The Hook, Habit, and Hobby Framework</h2>
        <p>Successful games operate on three levels: they hook players initially, form habits through regular play, and eventually become hobbies that players are passionate about.</p>
        
        <h3>The Initial Hook</h3>
        <p>The first few minutes of your game are critical. Players decide whether to continue within seconds. Key elements include:</p>
        <ul>
          <li><strong>Clear visual communication</strong> - Players should understand what they can do immediately</li>
          <li><strong>Immediate feedback</strong> - Every action should have a visible consequence</li>
          <li><strong>Progressive disclosure</strong> - Introduce complexity gradually</li>
        </ul>
        
        <h3>Building Habits</h3>
        <p>Once hooked, games need to create habits. This involves:</p>
        <ul>
          <li><strong>Consistent reward schedules</strong> - Predictable rewards keep players coming back</li>
          <li><strong>Variable ratio reinforcement</strong> - Occasional unexpected rewards create excitement</li>
          <li><strong>Social obligations</strong> - Multiplayer elements that make players feel responsible to others</li>
        </ul>
        
        <h2>The Role of Flow State</h2>
        <p>Flow state occurs when challenge matches skill level perfectly. Games should dynamically adjust difficulty to maintain this balance.</p>
        
        <h3>Implementing Dynamic Difficulty</h3>
        <pre><code>public class DynamicDifficulty {
    private float playerSkillLevel;
    private float currentDifficulty;
    
    public void AdjustDifficulty() {
        if (playerPerformance > targetPerformance) {
            IncreaseDifficulty();
        } else if (playerPerformance < minPerformance) {
            DecreaseDifficulty();
        }
    }
}</code></pre>
        
        <h2>Progression Systems</h2>
        <p>Effective progression systems provide both short-term and long-term goals, creating a sense of constant advancement.</p>
        
        <h3>Types of Progression</h3>
        <ul>
          <li><strong>Linear progression</strong> - Clear path forward (levels, XP)</li>
          <li><strong>Branching progression</strong> - Multiple paths (skill trees)</li>
          <li><strong>Emergent progression</strong> - Player-created goals</li>
        </ul>
        
        <h2>Conclusion</h2>
        <p>Understanding player psychology allows developers to create more engaging experiences. The key is balancing challenge, reward, and social elements to create games that players truly care about.</p>
      `,
      author: 'Sarah Chen',
      authorBio: 'Lead Game Designer with 10+ years in AAA game development. Former Blizzard and Riot Games designer.',
      publishDate: 'December 15, 2024',
      readTime: '8 min',
      category: 'Game Design',
      tags: ['Psychology', 'Player Engagement', 'Game Design', 'Flow State'],
      views: '12.5K',
      featured: true
    },
    {
      id: 2,
      title: 'Building Immersive Worlds: A Designer\'s Guide',
      content: `
        <p>World building is one of the most challenging and rewarding aspects of game development. A well-crafted world can transport players to another reality and keep them engaged for hundreds of hours.</p>
        
        <h2>The Foundation: Establishing Rules</h2>
        <p>Every game world needs consistent rules that govern how it operates. These rules should be:</p>
        <ul>
          <li><strong>Internally consistent</strong> - No contradictions within your world</li>
          <li><strong>Clearly communicated</strong> - Players should understand the rules</li>
          <li><strong>Meaningful</strong> - Rules should serve the gameplay and narrative</li>
        </ul>
        
        <h2>Environmental Storytelling</h2>
        <p>The best game worlds tell stories through their environment, not just through dialogue and cutscenes.</p>
        
        <h3>Visual Narrative Techniques</h3>
        <ul>
          <li><strong>Environmental clues</strong> - Objects that hint at past events</li>
          <li><strong>Architectural storytelling</strong> - Building design that reflects culture</li>
          <li><strong>Lighting and mood</strong> - Atmosphere that supports the narrative</li>
        </ul>
        
        <h2>Creating Believable Ecosystems</h2>
        <p>Game worlds feel more real when they operate as living ecosystems with interconnected systems.</p>
      `,
      author: 'Marcus Rodriguez',
      authorBio: 'Senior World Designer specializing in open-world games and environmental storytelling.',
      publishDate: 'December 12, 2024',
      readTime: '12 min',
      category: 'World Building',
      tags: ['World Building', 'Environment Design', 'Storytelling', 'Level Design'],
      views: '8.9K'
    },
    {
      id: 3,
      title: 'The Art of Balancing Game Mechanics',
      content: `
        <p>Game balance is both an art and a science. It requires understanding mathematics, psychology, and player behavior to create mechanics that feel fair and engaging.</p>
        
        <h2>Understanding Balance Types</h2>
        <p>Different types of balance serve different purposes in game design:</p>
        
        <h3>Symmetric vs Asymmetric Balance</h3>
        <p><strong>Symmetric balance</strong> gives all players identical tools and abilities. <strong>Asymmetric balance</strong> gives different players different strengths and weaknesses that should theoretically balance out.</p>
        
        <h2>The Balance Testing Process</h2>
        <ol>
          <li><strong>Theoretical analysis</strong> - Mathematical modeling</li>
          <li><strong>Internal testing</strong> - Developer playtests</li>
          <li><strong>Beta testing</strong> - Community feedback</li>
          <li><strong>Live iteration</strong> - Post-launch adjustments</li>
        </ol>
      `,
      author: 'Alex Thompson',
      authorBio: 'Game Balance Analyst with expertise in competitive multiplayer games.',
      publishDate: 'December 10, 2024',
      readTime: '6 min',
      category: 'Game Balance',
      tags: ['Game Balance', 'Mechanics', 'Difficulty', 'Mathematics'],
      views: '15.2K'
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadArticle(id);
    this.loadRelatedArticles(id);
  }

  private loadArticle(id: number) {
    this.article = this.articlesData.find(a => a.id === id);
    if (!this.article) {
      this.router.navigate(['/articles']);
    }
  }

  private loadRelatedArticles(currentId: number) {
    this.relatedArticles = this.articlesData
      .filter(a => a.id !== currentId)
      .slice(0, 3);
  }

  navigateToArticle(articleId: number) {
    this.router.navigate(['/articles', articleId]);
  }

  shareArticle() {
    if (navigator.share) {
      navigator.share({
        title: this.article.title,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  }
}