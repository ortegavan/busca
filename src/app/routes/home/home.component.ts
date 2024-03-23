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
import { PaginatorModule } from 'primeng/paginator';
import { DropdownModule } from 'primeng/dropdown';
import { CategoryService } from '../../services/category.service';
import { TagService } from '../../services/tag.service';
import { RecipeService } from '../../services/recipe.service';
import { Observable } from 'rxjs';
import { Category } from '../../models/category.model';
import { Recipe } from '../../models/recipe.model';
import { Tag } from '../../models/tag.model';

type PageEvent = {
    first?: number;
    page?: number;
    pageCount?: number;
    rows?: number;
};

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
        PaginatorModule,
        DropdownModule,
    ],
})
export class HomeComponent implements OnInit {
    first: number = 0;
    rows: number = 9;

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

    onPageChange(event: PageEvent) {
        this.first = event.first || 0;
        this.rows = event.rows || 9;
    }
}
