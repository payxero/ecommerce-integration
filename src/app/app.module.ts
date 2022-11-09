import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { CardInfoModule } from './core/components/card-info/card-info.module';
import { PaymentService } from './core/services';
import { LoadingModule } from './core/components/loading/loading.module';
import { CommonModule } from '@angular/common';


@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        CardInfoModule,
        FlexLayoutModule,
        FormsModule,
        HttpClientModule,
        LoadingModule,
        MaterialModule,
        ReactiveFormsModule,
        RouterModule.forRoot([]),
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent],
    providers: [PaymentService]
})
export class AppModule { }
