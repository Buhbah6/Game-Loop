// Base Strapi response interfaces
export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiEntity {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface StrapiImage {
  id: number;
  documentId: string;
  name: string;
  alternativeText?: string;
  caption?: string;
  width: number;
  height: number;
  formats?: {
    thumbnail?: StrapiImageFormat;
    small?: StrapiImageFormat;
    medium?: StrapiImageFormat;
    large?: StrapiImageFormat;
  };
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface StrapiImageFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path?: string;
  width: number;
  height: number;
  size: number;
  url: string;
}

// Content type interfaces
export interface Article extends StrapiEntity {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  readTime: string;
  featured: boolean;
  publishDate: string;
  views: string;
  likes?: string;
  category: {
    data: Category;
  };
  author: {
    data: Author;
  };
  tags: {
    data: Tag[];
  };
  featuredImage?: {
    data: StrapiImage;
  };
}

export interface Tutorial extends StrapiEntity {
  title: string;
  slug: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  featured: boolean;
  publishDate: string;
  views: string;
  likes: string;
  rating: number;
  totalRatings: number;
  whatYouLearn: string[];
  requirements: string[];
  chapters: TutorialChapter[];
  category: {
    data: Category;
  };
  instructor: {
    data: Instructor;
  };
  tags: {
    data: Tag[];
  };
  thumbnail?: {
    data: StrapiImage;
  };
}

export interface TutorialChapter {
  title: string;
  duration: string;
  description: string;
  completed?: boolean;
}

export interface Video extends StrapiEntity {
  title: string;
  slug: string;
  description: string;
  duration: string;
  views: string;
  likes: string;
  publishDate: string;
  videoUrl?: string;
  chapters: VideoChapter[];
  category: {
    data: Category;
  };
  creator: {
    data: Creator;
  };
  tags: {
    data: Tag[];
  };
  thumbnail?: {
    data: StrapiImage;
  };
}

export interface VideoChapter {
  title: string;
  time: string;
  duration: string;
}

export interface Category extends StrapiEntity {
  name: string;
  slug: string;
  description?: string;
  color?: string;
}

export interface Tag extends StrapiEntity {
  name: string;
  slug: string;
}

export interface Author extends StrapiEntity {
  name: string;
  slug: string;
  bio: string;
  avatar?: {
    data: StrapiImage;
  };
}

export interface Instructor extends StrapiEntity {
  name: string;
  slug: string;
  bio: string;
  experience?: string;
  avatar?: {
    data: StrapiImage;
  };
}

export interface Creator extends StrapiEntity {
  name: string;
  slug: string;
  bio: string;
  subscriberCount?: string;
  avatar?: {
    data: StrapiImage;
  };
}

// API query parameters
export interface StrapiQueryParams {
  populate?: string | string[] | object;
  filters?: object;
  sort?: string | string[];
  pagination?: {
    page?: number;
    pageSize?: number;
    start?: number;
    limit?: number;
  };
  fields?: string[];
  publicationState?: 'live' | 'preview';
  locale?: string;
}