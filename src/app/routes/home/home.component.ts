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
import {
    Observable,
    combineLatest,
    debounceTime,
    distinct,
    distinctUntilChanged,
    filter,
    map,
    merge,
    startWith,
    tap,
    zip,
} from 'rxjs';
import { Category } from '../../models/category.model';
import { Recipe } from '../../models/recipe.model';
import { Tag } from '../../models/tag.model';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
        FormsModule,
        ReactiveFormsModule,
    ],
})
export class HomeComponent implements OnInit {
    first: number = 0;
    rows: number = 9;

    categoryService = inject(CategoryService);
    tagService = inject(TagService);
    recipeService = inject(RecipeService);
    fb = inject(FormBuilder);

    categories$!: Observable<Category[]>;
    tags$!: Observable<Tag[]>;
    recipes$!: Observable<Recipe[]>;
    filteredRecipes$!: Observable<Recipe[]>;

    form!: FormGroup;

    ngOnInit(): void {
        this.categories$ = this.categoryService.getCategories();
        this.tags$ = this.tagService.getTags();
        this.recipes$ = this.recipeService.getRecipes();

        this.form = this.fb.group({
            search: '',
            categories: this.fb.array([]),
            tags: this.fb.array([]),
        });

        this.categories$.subscribe((items) => {
            const itemsControls = items.map(() => new FormControl(0));
            this.form.setControl('categories', this.fb.array(itemsControls));
        });

        this.tags$.subscribe((items) => {
            const itemsControls = items.map(() => new FormControl(false));
            this.form.setControl('tags', this.fb.array(itemsControls));
        });

        const search$ = this.form.get('search')?.valueChanges.pipe(
            startWith(''),
            debounceTime(333),
            distinctUntilChanged(),
            filter((value) => value.length >= 2)
        );

        const others$ = this.form.valueChanges
            .pipe(
                startWith(this.form.value),
                map((value) => {
                    const { search, ...others } = value;
                    return others;
                })
            )
            .subscribe((value) => console.log(value));

        this.filteredRecipes$ = combineLatest([
            this.form.valueChanges.pipe(startWith(this.form.value)),
            this.recipes$,
            this.tags$,
        ]).pipe(
            map(([value, recipes, tags]) => {
                const selectedCategories = value.categories
                    .flat()
                    .filter((c: number) => c > 0);

                const selectedTags = tags
                    .filter((tag, index) => value.tags[index])
                    .map((tag) => tag.id);

                const search = value.search.toLowerCase();

                return recipes.filter(
                    (recipe) =>
                        ((selectedCategories.length === 0 ||
                            recipe.categories.some((category) =>
                                selectedCategories.includes(category)
                            )) &&
                            (selectedTags.length === 0 ||
                                recipe.tags.some((tag) =>
                                    selectedTags.includes(tag)
                                )) &&
                            (search.length === 0 ||
                                recipe.title.toLowerCase().includes(search) ||
                                recipe.description
                                    .toLocaleLowerCase()
                                    .includes(search))) ||
                        recipe.ingredients.some((ingredient) =>
                            ingredient.toLowerCase().includes(search)
                        )
                );
            })
        );
    }

    onPageChange(event: PageEvent) {
        this.first = event.first || 0;
        this.rows = event.rows || 9;
    }

    change() {
        console.log(this.form.value);
    }
}
