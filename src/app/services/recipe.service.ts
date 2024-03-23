import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Recipe } from '../models/recipe.model';

@Injectable({
    providedIn: 'root',
})
export class RecipeService {
    endpoint = 'assets/db.json';
    httpClient = inject(HttpClient);

    public getRecipes(): Observable<Recipe[]> {
        return this.httpClient.get<Recipe[]>(this.endpoint);
    }
}
