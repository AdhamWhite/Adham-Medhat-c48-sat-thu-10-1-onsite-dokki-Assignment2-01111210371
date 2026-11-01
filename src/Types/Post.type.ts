export interface PostType {
  _id: string;
  body: string;
  image?: string;
  privacy: string;
  user: User;
  sharedPost: any;
  likes: any[];
  createdAt: string;
  commentsCount: number;
  topComment: any;
  sharesCount: number;
  likesCount: number;
  isShare: boolean;
  id: string;
  bookmarked: boolean;
}

export interface User {
  _id: string;
  name: string;
  username: string;
  photo: string;
 
}
