import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
    providedIn: 'root',
})
export class CategoryService {
    categories = [
        'Carnes',
        'Aves',
        'Peixes e frutos do mar',
        'Vegetarianos',
        'Saladas',
        'Massas',
        'Sobremesas',
    ];

    constructor() {}

    public getCategories(): Observable<Category[]> {
        return of(
            this.categories.map((category, index) => ({
                id: index + 1,
                title: category,
            }))
        );
    }
}
