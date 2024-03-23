import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Tag } from '../models/tag.model';

@Injectable({
    providedIn: 'root',
})
export class TagService {
    tags = ['Rápido', 'Saudável', 'Fácil', 'Sem glúten', 'Sem lactose'];

    constructor() {}

    public getTags(): Observable<Tag[]> {
        return of(
            this.tags.map((tag, index) => ({
                id: index + 1,
                title: tag,
            }))
        );
    }
}
