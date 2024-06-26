import { Difficulty } from '../enums/difficulty';

export type Recipe = {
    id: number;
    title: string;
    description: string;
    image: string;
    ingredients: string[];
    steps: string[];
    tags: number[];
    categories: number[];
    time: number;
    serves: number;
    difficulty: Difficulty;
    rating: number;
};
