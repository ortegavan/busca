import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { DropdownModule } from 'primeng/dropdown';
import { Recipe } from '../../models/recipe.model';
import { RecipeComponent } from '../recipe/recipe.component';

@Component({
    selector: 'app-recipes',
    standalone: true,
    templateUrl: './recipes.component.html',
    styleUrl: './recipes.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, PaginatorModule, DropdownModule, RecipeComponent],
})
export class RecipesComponent {
    @Input({ required: true }) recipes!: Recipe[];

    first: number = 0;
    rows: number = 9;

    onPageChange(event: any) {
        this.first = event.first;
        this.rows = event.rows;
    }
}
