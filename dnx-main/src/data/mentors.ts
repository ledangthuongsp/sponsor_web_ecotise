import {
  Avatar1,
  Avatar2,
  Avatar3,
  Avatar4,
  Avatar5,
  Avatar6,
  Avatar7,
  Avatar8,
} from 'data/images';

export interface Mentor {
  id: number;
  name: string;
  title: string;
  avatar: string;
  task: number;
  rating: number;
  review: number;
  followed: boolean;
}

export const mentors: Mentor[] = [
  {
    id: 1,
    name: 'Curious George',
    title: 'UI UX Design',
    avatar: Avatar1,
    task: 40,
    rating: 4.7,
    review: 750,
    followed: false,
  },
  {
    id: 2,
    name: 'Abraham Lincoln',
    title: '3D Design',
    avatar: Avatar2,
    task: 32,
    rating: 4.9,
    review: 510,
    followed: true,
  },
];
