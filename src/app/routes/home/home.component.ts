import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryFilterComponent } from '../../layout/category-filter/category-filter.component';
import { HeaderComponent } from '../../ui/header/header.component';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DividerModule } from 'primeng/divider';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { CategoryService } from '../../services/category.service';
import { TagService } from '../../services/tag.service';
import { RecipeService } from '../../services/recipe.service';
import {
    Observable,
    Subject,
    combineLatest,
    debounceTime,
    distinctUntilChanged,
    filter,
    map,
    startWith,
    takeUntil,
} from 'rxjs';
import { Category } from '../../models/category.model';
import { Recipe } from '../../models/recipe.model';
import { Tag } from '../../models/tag.model';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecipesComponent } from '../../ui/recipes/recipes.component';

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
        FormsModule,
        ReactiveFormsModule,
        RecipesComponent,
    ],
})
export class HomeComponent implements OnInit, OnDestroy {
    categoryService = inject(CategoryService);
    tagService = inject(TagService);
    recipeService = inject(RecipeService);
    fb = inject(FormBuilder);

    subject$ = new Subject<void>();

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

        this.categories$.pipe(takeUntil(this.subject$)).subscribe((items) => {
            const itemsControls = items.map(() => new FormControl(0));
            this.form.setControl('categories', this.fb.array(itemsControls));
        });

        this.tags$.pipe(takeUntil(this.subject$)).subscribe((items) => {
            const itemsControls = items.map(() => new FormControl(false));
            this.form.setControl('tags', this.fb.array(itemsControls));
        });

        const search$ = this.form.get('search')!.valueChanges.pipe(
            startWith(''),
            filter((value) => value.length >= 2 || value.length === 0),
            debounceTime(666),
            distinctUntilChanged()
        );

        const others$ = this.form.valueChanges.pipe(
            startWith({
                categories: [],
                tags: [],
            }),
            map((value) => {
                const { search, ...rest } = value;
                return rest;
            })
        );

        this.filteredRecipes$ = combineLatest([
            search$,
            others$,
            this.recipes$,
            this.tags$,
        ]).pipe(
            map(([search, others, recipes, tags]) => {
                const selectedCategories = others.categories
                    .flat()
                    .filter((c: number) => c > 0);

                const selectedTags = tags
                    .filter((tag, index) => others.tags[index])
                    .map((tag) => tag.id);

                return recipes.filter(
                    (recipe) =>
                        (selectedCategories.length === 0 ||
                            recipe.categories.some((category) =>
                                selectedCategories.includes(category)
                            )) &&
                        (selectedTags.length === 0 ||
                            recipe.tags.some((tag) =>
                                selectedTags.includes(tag)
                            )) &&
                        (recipe.title
                            .toLowerCase()
                            .includes(search.toLowerCase()) ||
                            recipe.description
                                .toLowerCase()
                                .includes(search.toLowerCase()))
                );
            })
        );
    }

    ngOnDestroy(): void {
        this.subject$.next();
        this.subject$.complete();
    }
}
