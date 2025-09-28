import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment.ts';
import { 
  StrapiResponse, 
  Article, 
  Tutorial, 
  Video, 
  Category,
  StrapiQueryParams 
} from '../interfaces/strapi.interface';

@Injectable({
  providedIn: 'root'
})
export class StrapiService {
  private readonly baseUrl = environment.strapi.url;
  private readonly apiUrl = `${this.baseUrl}/api`;
  private readonly apiToken = environment.strapi.apiToken;

  // Mock data flag - set to false to use real Strapi data by default
  private useMockData = false;

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
      console.log('Using mock data for:', endpoint);
      return this.getMockData<T>(endpoint);
    }

    console.log('Attempting to fetch from Strapi:', `${this.apiUrl}/${endpoint}`);

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
      map(response => {
        console.log('Strapi response for', endpoint, ':', response);
        return response;
      }),
      catchError(error => {
        console.error('Strapi API error for', endpoint, ':', error);
        console.warn('Falling back to mock data');
        this.useMockData = true;
        return this.getMockData<T>(endpoint);
      })
    );
  }

  // Articles
  getArticles(params?: StrapiQueryParams): Observable<Article[]> {
    return this.get<Article[]>('articles', {
      populate: '*',
      sort: ['createdAt:desc'],
      ...params
    }).pipe(
      map(response => response.data)
    );
  }

  getArticle(id: string): Observable<Article> {
    return this.get<Article>(`articles/${id}`, {
      populate: '*'
    }).pipe(
      map(response => response.data)
    );
  }

  getFeaturedArticles(): Observable<Article[]> {
    return this.getArticles({
      pagination: { limit: 1 }
    });
  }

  // Tutorials
  getTutorials(params?: StrapiQueryParams): Observable<Tutorial[]> {
    return this.get<Tutorial[]>('tutorials', {
      populate: '*',
      sort: ['createdAt:desc'],
      ...params
    }).pipe(
      map(response => response.data)
    );
  }

  getTutorial(id: string): Observable<Tutorial> {
    return this.get<Tutorial>(`tutorials/${id}`, {
      populate: '*'
    }).pipe(
      map(response => response.data)
    );
  }

  getFeaturedTutorials(): Observable<Tutorial[]> {
    return this.getTutorials({
      pagination: { limit: 3 }
    });
  }

  // Videos
  getVideos(params?: StrapiQueryParams): Observable<Video[]> {
    return this.get<Video[]>('videos', {
      populate: '*',
      sort: ['createdAt:desc'],
      ...params
    }).pipe(
      map(response => response.data)
    );
  }

  getVideo(id: string): Observable<Video> {
    return this.get<Video>(`videos/${id}`, {
      populate: '*'
    }).pipe(
      map(response => response.data)
    );
  }

  getFeaturedVideos(): Observable<Video[]> {
    return this.getVideos({
      pagination: { limit: 1 }
    });
  }

  // Search methods
  searchArticles(query: string): Observable<StrapiResponse<Article[]>> {
    return this.get<Article[]>('articles', {
      populate: 'coverImage',
      filters: {
        '$or': [
          { 'title': { '$containsi': query } },
          { 'summary': { '$containsi': query } },
          { 'body': { '$containsi': query } }
        ]
      },
      sort: ['createdAt:desc'],
      pagination: { limit: 10 }
    });
  }

  searchTutorials(query: string): Observable<StrapiResponse<Tutorial[]>> {
    return this.get<Tutorial[]>('tutorials', {
      populate: 'coverImage',
      filters: {
        '$or': [
          { 'title': { '$containsi': query } },
          { 'description': { '$containsi': query } },
          { 'body': { '$containsi': query } }
        ]
      },
      sort: ['createdAt:desc'],
      pagination: { limit: 10 }
    });
  }

  searchVideos(query: string): Observable<StrapiResponse<Video[]>> {
    return this.get<Video[]>('videos', {
      populate: ['thumbnail', 'article', 'tutorial'],
      filters: {
        'title': { '$containsi': query }
      },
      sort: ['createdAt:desc'],
      pagination: { limit: 10 }
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

  // Mock data methods (for development when Strapi is not available)
  private getMockData<T>(endpoint: string): Observable<StrapiResponse<T>> {
    const mockData = this.generateMockData(endpoint);
    return of({ data: mockData } as StrapiResponse<T>);
  }

  private generateMockData(endpoint: string): any {
    if (endpoint === 'articles' || endpoint.startsWith('articles/')) {
      return this.getMockArticles(endpoint);
    } else if (endpoint === 'tutorials' || endpoint.startsWith('tutorials/')) {
      return this.getMockTutorials(endpoint);
    } else if (endpoint === 'videos' || endpoint.startsWith('videos/')) {
      return this.getMockVideos(endpoint);
    } else if (endpoint === 'categories') {
      return this.getMockCategories();
    }
    
    return [];
  }

  private getMockArticles(endpoint: string): any[] | any {
    const articles = [
      {
        id: 1,
        documentId: 'article-1',
        createdAt: '2024-12-15T10:00:00Z',
        updatedAt: '2024-12-15T10:00:00Z',
        publishedAt: '2024-12-15T10:00:00Z',
        title: 'Advanced Player Engagement Strategies',
        slug: 'advanced-player-engagement-strategies',
        summary: 'Discover how top game studios create compelling player experiences that drive long-term engagement and retention through innovative mechanics and psychological insights.',
        body: 'Player engagement is the holy grail of game development...'
      },
      {
        id: 2,
        documentId: 'article-2',
        createdAt: '2024-12-12T10:00:00Z',
        updatedAt: '2024-12-12T10:00:00Z',
        publishedAt: '2024-12-12T10:00:00Z',
        title: 'Building Immersive Game Worlds',
        slug: 'building-immersive-worlds',
        summary: 'Learn the art of world-building that captivates players and creates memorable gaming experiences.',
        body: 'World building content here...'
      },
      {
        id: 3,
        documentId: 'article-3',
        createdAt: '2024-12-10T10:00:00Z',
        updatedAt: '2024-12-10T10:00:00Z',
        publishedAt: '2024-12-10T10:00:00Z',
        title: 'The Art of Game Balance',
        slug: 'art-of-game-balance',
        summary: 'Understanding the delicate balance between challenge and reward in game design.',
        body: 'Game balance content here...'
      }
    ];

    if (endpoint.includes('/')) {
      const id = parseInt(endpoint.split('/')[1]);
      return articles.find(a => a.id === id) || articles[0];
    }
    
    return articles;
  }

  private getMockTutorials(endpoint: string): any[] | any {
    const tutorials = [
      {
        id: 1,
        documentId: 'tutorial-1',
        createdAt: '2024-12-18T10:00:00Z',
        updatedAt: '2024-12-18T10:00:00Z',
        publishedAt: '2024-12-18T10:00:00Z',
        title: 'Unity 2D Game Development Basics',
        slug: 'unity-2d-game-development-basics',
        description: 'Learn to create complete 2D games in Unity from scratch. This comprehensive tutorial covers everything from basic concepts to advanced game mechanics.',
        body: 'Tutorial content here...'
      },
      {
        id: 2,
        documentId: 'tutorial-2',
        createdAt: '2024-12-16T10:00:00Z',
        updatedAt: '2024-12-16T10:00:00Z',
        publishedAt: '2024-12-16T10:00:00Z',
        title: 'Pixel Art Character Design',
        slug: 'pixel-art-character-design',
        description: 'Master the fundamentals of creating compelling pixel art characters.',
        body: 'Pixel art tutorial content here...'
      }
    ];

    if (endpoint.includes('/')) {
      const id = parseInt(endpoint.split('/')[1]);
      return tutorials.find(t => t.id === id) || tutorials[0];
    }
    
    return tutorials;
  }

  private getMockVideos(endpoint: string): any[] | any {
    const videos = [
      {
        id: 1,
        documentId: 'video-1',
        createdAt: '2024-12-20T10:00:00Z',
        updatedAt: '2024-12-20T10:00:00Z',
        publishedAt: '2024-12-20T10:00:00Z',
        title: 'Unity 3D Game Development Tutorial',
        youtubeURL: 'https://www.youtube.com/watch?v=example'
      }
    ];

    if (endpoint.includes('/')) {
      const id = parseInt(endpoint.split('/')[1]);
      return videos.find(v => v.id === id) || videos[0];
    }
    
    return videos;
  }

  private getMockCategories(): any[] {
    return [
      { id: 1, documentId: 'cat-1', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z', name: 'Game Design', slug: 'game-design', color: '#a855f7' },
      { id: 2, documentId: 'cat-2', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z', name: 'Programming', slug: 'programming', color: '#10b981' },
      { id: 3, documentId: 'cat-3', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z', name: 'Art', slug: 'art', color: '#f59e0b' }
    ];
  }

  // Utility method to toggle between mock and real data
  setUseMockData(useMock: boolean): void {
    this.useMockData = useMock;
  }

  // Method to test Strapi connection
  testConnection(): Observable<boolean> {
    const headers = this.getHeaders();
    console.log('Testing Strapi connection to:', `${this.apiUrl}/articles`);
    console.log('Using headers:', headers);
    
    return this.http.get(`${this.apiUrl}/articles?pagination[limit]=1`, { headers }).pipe(
      map((response) => {
        console.log('✅ Strapi connection successful:', response);
        this.useMockData = false;
        return true;
      }),
      catchError((error) => {
        console.error('❌ Strapi connection failed:', error);
        this.useMockData = true;
        return of(false);
      })
    );
  }
}