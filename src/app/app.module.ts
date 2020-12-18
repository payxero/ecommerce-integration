import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from './app.component';
import { MaterialModule } from './modules/material.module';
import { ZeroCardInfoModule } from '@appCore/components/card-info/card-info.module';
import { PaymentService } from '@appCore/services';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule.forRoot([]),
    ZeroCardInfoModule
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [PaymentService]
})
export class AppModule { }
