export interface User {
  email: string;
  token: string;
  username: string;
  bio: string | null;
  image: string | null;
}

export interface Profile {
  username: string;
  bio: string | null;
  image: string | null;
  following: boolean;
}

export interface Article {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
  author: Profile;
}

export interface Comment {
  id: number;
  createdAt: string;
  updatedAt: string;
  body: string;
  author: Profile;
}

export interface ArticlesResponse {
  articles: Article[];
  articlesCount: number;
}

export interface SingleArticleResponse {
  article: Article;
}

export interface CommentsResponse {
  comments: Comment[];
}

export interface ProfileResponse {
  profile: Profile;
}

export interface UserResponse {
  user: User;
}

export interface TagsResponse {
  tags: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  username: string;
}

export interface UpdateUserData {
  email?: string;
  username?: string;
  bio?: string;
  image?: string;
  password?: string;
}

export interface CreateArticleData {
  title: string;
  description: string;
  body: string;
  tagList?: string[];
}

export interface UpdateArticleData extends Partial<CreateArticleData> {}

export interface CreateCommentData {
  body: string;
}
