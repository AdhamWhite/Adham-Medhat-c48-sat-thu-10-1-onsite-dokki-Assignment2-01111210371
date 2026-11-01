export interface UserType {
  bookmarks: string[];
  bookmarksCount: number;
  cover?: string;
  createdAt: string;
  dateOfBirth: string;
  email: string;
  followers: string[];
  followersCount: number;
  following: string[];
  followingCount: number;
  gender: 'male' | 'female' | string;
  id: string;
  name?: string;
  photo: string;
  username: string;
  _id: string;
}
