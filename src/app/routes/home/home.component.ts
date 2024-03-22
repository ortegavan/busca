import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryFilterComponent } from '../../layout/category-filter/category-filter.component';
import { HeaderComponent } from '../../ui/header/header.component';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DividerModule } from 'primeng/divider';
import { ToggleButtonModule } from 'primeng/togglebutton';

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
    ],
})
export class HomeComponent {
    categories = [
        'Carnes',
        'Aves',
        'Peixes e frutos do mar',
        'Vegetarianos',
        'Saladas',
        'Massas',
        'Sobremesas',
    ];

    tags = ['Rápido', 'Saudável', 'Fácil', 'Sem glúten', 'Sem lactose'];
}
