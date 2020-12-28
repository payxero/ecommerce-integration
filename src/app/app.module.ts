import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { CardInfoModule } from './core/components/card-info/card-info.module';
import { PaymentService } from './core/services';
import { GraphQLModule } from './graphql.module';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CardInfoModule,
    FlexLayoutModule,
    FormsModule,
    GraphQLModule,
    HttpClientModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule.forRoot([]),
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [PaymentService]
})
export class AppModule { }
