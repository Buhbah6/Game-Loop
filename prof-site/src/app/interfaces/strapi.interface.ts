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

// Content type interfaces updated to match actual Strapi schema
export interface Article extends StrapiEntity {
  title: string;
  slug: string;
  coverImage?: StrapiImage;
  summary: string;
  body: string;
  video?: any;
}

export interface Tutorial extends StrapiEntity {
  title: string;
  slug: string;
  coverImage?: StrapiImage[];
  description: string;
  body: string;
  video?: any;
}

export interface Video extends StrapiEntity {
  title: string;
  youtubeURL?: string;
  thumbnail?: {
    data: StrapiImage;
  };
  article?: {
    data: Article;
  };
  tutorial?: {
    data: Tutorial;
  };
}

export interface Category extends StrapiEntity {
  name: string;
  slug: string;
  description?: string;
  color?: string;
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