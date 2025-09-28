import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { 
  StrapiResponse, 
  Article, 
  Tutorial, 
  Video, 
  Category,
  Tag,
  StrapiQueryParams 
} from '../interfaces/strapi.interface';

@Injectable({
  providedIn: 'root'
})
export class StrapiService {
  private readonly baseUrl = environment.strapi.url;
  private readonly apiUrl = `${this.baseUrl}/api`;
  private readonly apiToken = environment.strapi.apiToken;

  // Mock data flag - set to true to use mock data when Strapi is not available
  private useMockData = true;

  constructor(private http: HttpClient) {}

  // Get headers with authorization if API token is available
  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (this.apiToken) {
      headers = headers.set('Authorization', `Bearer ${this.apiToken}`);
    }

    return headers;
  }

  // Generic method to fetch data from Strapi
  private get<T>(endpoint: string, params?: StrapiQueryParams): Observable<StrapiResponse<T>> {
    if (this.useMockData) {
      return this.getMockData<T>(endpoint);
    }

    let httpParams = new HttpParams();
    
    if (params) {
      if (params.populate) {
        if (typeof params.populate === 'string') {
          httpParams = httpParams.set('populate', params.populate);
        } else if (Array.isArray(params.populate)) {
          httpParams = httpParams.set('populate', params.populate.join(','));
        } else {
          httpParams = httpParams.set('populate', JSON.stringify(params.populate));
        }
      }
      
      if (params.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
          httpParams = httpParams.set(`filters[${key}]`, value as string);
        });
      }
      
      if (params.sort) {
        const sortValue = Array.isArray(params.sort) ? params.sort.join(',') : params.sort;
        httpParams = httpParams.set('sort', sortValue);
      }
      
      if (params.pagination) {
        Object.entries(params.pagination).forEach(([key, value]) => {
          httpParams = httpParams.set(`pagination[${key}]`, value.toString());
        });
      }
      
      if (params.fields) {
        httpParams = httpParams.set('fields', params.fields.join(','));
      }
      
      if (params.publicationState) {
        httpParams = httpParams.set('publicationState', params.publicationState);
      }
    }

    const headers = this.getHeaders();

    return this.http.get<StrapiResponse<T>>(`${this.apiUrl}/${endpoint}`, { 
      params: httpParams, 
      headers: headers 
    }).pipe(
      catchError(error => {
        console.warn('Strapi API error, falling back to mock data:', error);
        this.useMockData = true;
        return this.getMockData<T>(endpoint);
      })
    );
  }

  // Articles
  getArticles(params?: StrapiQueryParams): Observable<Article[]> {
    return this.get<Article[]>('articles', {
      populate: ['category', 'author', 'tags', 'featuredImage'],
      sort: ['publishDate:desc'],
      ...params
    }).pipe(
      map(response => response.data)
    );
  }

  getArticle(id: string): Observable<Article> {
    return this.get<Article>(`articles/${id}`, {
      populate: ['category', 'author', 'tags', 'featuredImage']
    }).pipe(
      map(response => response.data)
    );
  }

  getFeaturedArticles(): Observable<Article[]> {
    return this.getArticles({
      filters: { featured: true },
      pagination: { limit: 1 }
    });
  }

  // Tutorials
  getTutorials(params?: StrapiQueryParams): Observable<Tutorial[]> {
    return this.get<Tutorial[]>('tutorials', {
      populate: ['category', 'instructor', 'tags', 'thumbnail'],
      sort: ['publishDate:desc'],
      ...params
    }).pipe(
      map(response => response.data)
    );
  }

  getTutorial(id: string): Observable<Tutorial> {
    return this.get<Tutorial>(`tutorials/${id}`, {
      populate: ['category', 'instructor', 'tags', 'thumbnail']
    }).pipe(
      map(response => response.data)
    );
  }

  getFeaturedTutorials(): Observable<Tutorial[]> {
    return this.getTutorials({
      filters: { featured: true },
      pagination: { limit: 3 }
    });
  }

  // Videos
  getVideos(params?: StrapiQueryParams): Observable<Video[]> {
    return this.get<Video[]>('videos', {
      populate: ['category', 'creator', 'tags', 'thumbnail'],
      sort: ['publishDate:desc'],
      ...params
    }).pipe(
      map(response => response.data)
    );
  }

  getVideo(id: string): Observable<Video> {
    return this.get<Video>(`videos/${id}`, {
      populate: ['category', 'creator', 'tags', 'thumbnail']
    }).pipe(
      map(response => response.data)
    );
  }

  getFeaturedVideos(): Observable<Video[]> {
    return this.getVideos({
      filters: { featured: true },
      pagination: { limit: 1 }
    });
  }

  // Categories
  getCategories(): Observable<Category[]> {
    return this.get<Category[]>('categories', {
      sort: ['name:asc']
    }).pipe(
      map(response => response.data)
    );
  }

  // Tags
  getTags(): Observable<Tag[]> {
    return this.get<Tag[]>('tags', {
      sort: ['name:asc']
    }).pipe(
      map(response => response.data)
    );
  }

  // Mock data methods (for development when Strapi is not available)
  private getMockData<T>(endpoint: string): Observable<StrapiResponse<T>> {
    const mockData = this.generateMockData(endpoint);
    return of({ data: mockData } as StrapiResponse<T>);
  }

  private generateMockData(endpoint: string): any {
    const baseUrl = this.baseUrl;
    
    if (endpoint === 'articles' || endpoint.startsWith('articles/')) {
      return this.getMockArticles(endpoint);
    } else if (endpoint === 'tutorials' || endpoint.startsWith('tutorials/')) {
      return this.getMockTutorials(endpoint);
    } else if (endpoint === 'videos' || endpoint.startsWith('videos/')) {
      return this.getMockVideos(endpoint);
    } else if (endpoint === 'categories') {
      return this.getMockCategories();
    } else if (endpoint === 'tags') {
      return this.getMockTags();
    }
    
    return [];
  }

  private getMockArticles(endpoint: string): Article[] | Article {
    const articles: Article[] = [
      {
        id: 1,
        documentId: 'article-1',
        createdAt: '2024-12-15T10:00:00Z',
        updatedAt: '2024-12-15T10:00:00Z',
        publishedAt: '2024-12-15T10:00:00Z',
        title: 'The Psychology of Player Engagement: What Keeps Gamers Coming Back',
        slug: 'psychology-player-engagement',
        content: this.getMockArticleContent(),
        excerpt: 'Explore the fundamental principles that keep players hooked and how to implement them in your game design. From reward systems to flow state, discover what makes games truly engaging.',
        readTime: '8 min',
        featured: true,
        publishDate: 'December 15, 2024',
        views: '12.5K',
        likes: '1.2K',
        category: {
          data: {
            id: 1,
            documentId: 'cat-1',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
            name: 'Game Design',
            slug: 'game-design',
            color: '#a855f7'
          }
        },
        author: {
          data: {
            id: 1,
            documentId: 'author-1',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
            name: 'Sarah Chen',
            slug: 'sarah-chen',
            bio: 'Lead Game Designer with 10+ years in AAA game development. Former Blizzard and Riot Games designer.'
          }
        },
        tags: {
          data: [
            { id: 1, documentId: 'tag-1', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z', name: 'Psychology', slug: 'psychology' },
            { id: 2, documentId: 'tag-2', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z', name: 'Player Engagement', slug: 'player-engagement' },
            { id: 3, documentId: 'tag-3', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z', name: 'Game Design', slug: 'game-design' }
          ]
        }
      },
      {
        id: 2,
        documentId: 'article-2',
        createdAt: '2024-12-12T10:00:00Z',
        updatedAt: '2024-12-12T10:00:00Z',
        publishedAt: '2024-12-12T10:00:00Z',
        title: 'Building Immersive Worlds: A Designer\'s Guide',
        slug: 'building-immersive-worlds',
        content: 'World building content here...',
        excerpt: 'Learn the secrets behind creating compelling game worlds that players never want to leave.',
        readTime: '12 min',
        featured: false,
        publishDate: 'December 12, 2024',
        views: '8.9K',
        category: {
          data: {
            id: 2,
            documentId: 'cat-2',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
            name: 'World Building',
            slug: 'world-building',
            color: '#8b5cf6'
          }
        },
        author: {
          data: {
            id: 2,
            documentId: 'author-2',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
            name: 'Marcus Rodriguez',
            slug: 'marcus-rodriguez',
            bio: 'Senior World Designer specializing in open-world games and environmental storytelling.'
          }
        },
        tags: {
          data: [
            { id: 4, documentId: 'tag-4', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z', name: 'World Building', slug: 'world-building' },
            { id: 5, documentId: 'tag-5', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z', name: 'Environment Design', slug: 'environment-design' }
          ]
        }
      },
      {
        id: 3,
        documentId: 'article-3',
        createdAt: '2024-12-10T10:00:00Z',
        updatedAt: '2024-12-10T10:00:00Z',
        publishedAt: '2024-12-10T10:00:00Z',
        title: 'The Art of Balancing Game Mechanics',
        slug: 'balancing-game-mechanics',
        content: 'Game balance content here...',
        excerpt: 'Discover how to create perfectly balanced gameplay that challenges without frustrating players.',
        readTime: '6 min',
        featured: false,
        publishDate: 'December 10, 2024',
        views: '15.2K',
        category: {
          data: {
            id: 3,
            documentId: 'cat-3',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
            name: 'Game Balance',
            slug: 'game-balance',
            color: '#06b6d4'
          }
        },
        author: {
          data: {
            id: 3,
            documentId: 'author-3',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
            name: 'Alex Thompson',
            slug: 'alex-thompson',
            bio: 'Game Balance Analyst with expertise in competitive multiplayer games.'
          }
        },
        tags: {
          data: [
            { id: 6, documentId: 'tag-6', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z', name: 'Game Balance', slug: 'game-balance' },
            { id: 7, documentId: 'tag-7', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z', name: 'Mechanics', slug: 'mechanics' }
          ]
        }
      }
    ];

    if (endpoint.includes('/')) {
      const id = parseInt(endpoint.split('/')[1]);
      return articles.find(a => a.id === id) || articles[0];
    }
    
    return articles;
  }

  private getMockTutorials(endpoint: string): Tutorial[] | Tutorial {
    const tutorials: Tutorial[] = [
      {
        id: 1,
        documentId: 'tutorial-1',
        createdAt: '2024-12-18T10:00:00Z',
        updatedAt: '2024-12-18T10:00:00Z',
        publishedAt: '2024-12-18T10:00:00Z',
        title: 'Unity 2D Game Development Masterclass',
        slug: 'unity-2d-masterclass',
        description: 'Learn to create complete 2D games in Unity from scratch. This comprehensive tutorial covers everything from basic concepts to advanced game mechanics.',
        duration: '4h 30m',
        difficulty: 'Beginner',
        featured: true,
        publishDate: 'December 18, 2024',
        views: '15.2K',
        likes: '1.2K',
        rating: 4.8,
        totalRatings: 324,
        whatYouLearn: [
          'Complete Unity 2D game development workflow',
          'C# programming for game development',
          'Player movement and physics implementation',
          'Enemy AI and behavior systems'
        ],
        requirements: [
          'Basic programming knowledge (any language)',
          'Computer with Unity 2022.3 LTS or newer',
          'At least 4GB of RAM'
        ],
        chapters: [
          { title: 'Introduction to Unity 2D', duration: '15:30', description: 'Overview of Unity 2D development environment and basic concepts.' },
          { title: 'Setting Up Your Project', duration: '12:45', description: 'Project setup, importing assets, and organizing your workspace.' },
          { title: 'Player Movement and Controls', duration: '22:15', description: 'Implementing smooth player movement with input handling.' }
        ],
        category: {
          data: {
            id: 4,
            documentId: 'cat-4',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
            name: 'Unity',
            slug: 'unity',
            color: '#000000'
          }
        },
        instructor: {
          data: {
            id: 1,
            documentId: 'instructor-1',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
            name: 'David Park',
            slug: 'david-park',
            bio: 'Senior Unity Developer with 8+ years of experience at indie and AAA studios.',
            experience: '8+ years'
          }
        },
        tags: {
          data: [
            { id: 8, documentId: 'tag-8', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z', name: 'Unity', slug: 'unity' },
            { id: 9, documentId: 'tag-9', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z', name: '2D Games', slug: '2d-games' }
          ]
        }
      }
    ];

    if (endpoint.includes('/')) {
      const id = parseInt(endpoint.split('/')[1]);
      return tutorials.find(t => t.id === id) || tutorials[0];
    }
    
    return tutorials;
  }

  private getMockVideos(endpoint: string): Video[] | Video {
    const videos: Video[] = [
      {
        id: 1,
        documentId: 'video-1',
        createdAt: '2024-12-20T10:00:00Z',
        updatedAt: '2024-12-20T10:00:00Z',
        publishedAt: '2024-12-20T10:00:00Z',
        title: 'Building Your First 3D Game in Unity - Complete Walkthrough',
        slug: 'first-3d-game-unity',
        description: 'In this comprehensive video tutorial, we\'ll walk through the entire process of creating a 3D platformer game in Unity from scratch.',
        duration: '45:30',
        views: '125.3K',
        likes: '8.2K',
        publishDate: 'December 20, 2024',
        chapters: [
          { title: 'Introduction & Project Setup', time: '0:00', duration: '3:20' },
          { title: 'Creating the Environment', time: '3:20', duration: '7:45' }
        ],
        category: {
          data: {
            id: 4,
            documentId: 'cat-4',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
            name: 'Unity Tutorials',
            slug: 'unity-tutorials',
            color: '#000000'
          }
        },
        creator: {
          data: {
            id: 1,
            documentId: 'creator-1',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
            name: 'GameDev Academy',
            slug: 'gamedev-academy',
            bio: 'Leading game development education channel with over 500K subscribers.',
            subscriberCount: '500K'
          }
        },
        tags: {
          data: [
            { id: 8, documentId: 'tag-8', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z', name: 'Unity', slug: 'unity' },
            { id: 10, documentId: 'tag-10', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z', name: '3D Game Development', slug: '3d-game-development' }
          ]
        }
      }
    ];

    if (endpoint.includes('/')) {
      const id = parseInt(endpoint.split('/')[1]);
      return videos.find(v => v.id === id) || videos[0];
    }
    
    return videos;
  }

  private getMockCategories(): Category[] {
    return [
      { id: 1, documentId: 'cat-1', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z', name: 'All', slug: 'all', color: '#6b7280' },
      { id: 2, documentId: 'cat-2', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z', name: 'Game Design', slug: 'game-design', color: '#a855f7' },
      { id: 3, documentId: 'cat-3', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z', name: 'Programming', slug: 'programming', color: '#10b981' },
      { id: 4, documentId: 'cat-4', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z', name: 'Art', slug: 'art', color: '#f59e0b' },
      { id: 5, documentId: 'cat-5', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z', name: 'Marketing', slug: 'marketing', color: '#ef4444' }
    ];
  }

  private getMockTags(): Tag[] {
    return [
      { id: 1, documentId: 'tag-1', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z', name: 'Unity', slug: 'unity' },
      { id: 2, documentId: 'tag-2', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z', name: 'Unreal Engine', slug: 'unreal-engine' },
      { id: 3, documentId: 'tag-3', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z', name: 'C#', slug: 'csharp' },
      { id: 4, documentId: 'tag-4', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z', name: '2D Games', slug: '2d-games' },
      { id: 5, documentId: 'tag-5', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z', name: 'Mobile', slug: 'mobile' }
    ];
  }

  private getMockArticleContent(): string {
    return `
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
      
      <h2>The Role of Flow State</h2>
      <p>Flow state occurs when challenge matches skill level perfectly. Games should dynamically adjust difficulty to maintain this balance.</p>
      
      <h2>Conclusion</h2>
      <p>Understanding player psychology allows developers to create more engaging experiences. The key is balancing challenge, reward, and social elements to create games that players truly care about.</p>
    `;
  }

  // Utility method to toggle between mock and real data
  setUseMockData(useMock: boolean): void {
    this.useMockData = useMock;
  }

  // Method to test Strapi connection
  testConnection(): Observable<boolean> {
    const headers = this.getHeaders();
    
    return this.http.get(`${this.apiUrl}/articles?pagination[limit]=1`, { headers }).pipe(
      map(() => {
        this.useMockData = false;
        return true;
      }),
      catchError(() => {
        this.useMockData = true;
        return of(false);
      })
    );
  }
}