import { Component } from '@angular/core';
import { CategoryFilterComponent } from '../../layout/category-filter/category-filter.component';
import { HeaderComponent } from '../../ui/header/header.component';

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    imports: [CategoryFilterComponent, HeaderComponent],
})
export class HomeComponent {}
