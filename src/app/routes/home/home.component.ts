import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryFilterComponent } from '../../layout/category-filter/category-filter.component';
import { HeaderComponent } from '../../ui/header/header.component';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DividerModule } from 'primeng/divider';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { RatingModule } from 'primeng/rating';
import { CategoryService } from '../../services/category.service';
import { TagService } from '../../services/tag.service';
import { RecipeService } from '../../services/recipe.service';
import { Observable } from 'rxjs';
import { Category } from '../../models/category.model';
import { Recipe } from '../../models/recipe.model';
import { Tag } from '../../models/tag.model';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    imports: [
        CommonModule,
        CategoryFilterComponent,
        HeaderComponent,
        CheckboxModule,
        InputTextModule,
        IconFieldModule,
        InputIconModule,
        DividerModule,
        ToggleButtonModule,
        RatingModule,
    ],
})
export class HomeComponent implements OnInit {
    categoryService = inject(CategoryService);
    tagService = inject(TagService);
    recipeService = inject(RecipeService);

    categories$!: Observable<Category[]>;
    tags$!: Observable<Tag[]>;
    recipes$!: Observable<Recipe[]>;

    ngOnInit(): void {
        this.categories$ = this.categoryService.getCategories();
        this.tags$ = this.tagService.getTags();
        this.recipes$ = this.recipeService.getRecipes();
    }
}
