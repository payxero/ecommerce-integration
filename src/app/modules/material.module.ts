import { NgModule } from '@angular/core';
import {
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatIconModule
} from '@angular/material';

@NgModule({
    imports: [
        MatButtonModule,
        MatInputModule,
        MatCardModule,
        MatIconModule
    ],
    exports: [
        MatButtonModule,
        MatInputModule,
        MatCardModule,
        MatIconModule
    ],
})
export class MaterialModule { }
