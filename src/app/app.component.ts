import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import * as _ from 'lodash';

import { ICardInfo } from './core/interfaces';
import { PaymentService } from './core/services';
import { chargeData } from './core/utils/chargeData';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})

export class AppComponent {
  publicKey: string;
  cardInfo: ICardInfo;
  charge: any;

  constructor(
      private paymentService: PaymentService,
      private matSnackBar: MatSnackBar,
  ) {
    this.publicKey = 'q7nFSA-YbnMWa-rQmamh-Jvm5Ep';
  }

  loadCardInfo(card: ICardInfo) {
    const zip = _.get(card, 'zipCode');
    this.cardInfo = _.omit(card, ['zipCode']);
    this.charge = chargeData;
    this.charge.card = this.cardInfo;
    this.charge.billingAddress.zipCode = zip;
  }

  submitPayment() {
    if (this.cardInfo) {
      this.paymentService.submitPayment(this.charge).then(response => {
        if (_.hasIn(response, 'errors') && !_.isNil(response.errors)) {
          const message = response.errors[0].message
          this.matSnackBar.open(`There was an error sending the query. ${message}`, 'OK', {
            verticalPosition: 'top',
            duration: 5000,
          });
        } else {
          const transaction = _.get(response.data, 'transactionId');
          this.matSnackBar.open(`Transaction ${transaction} Success`, 'OK', {
            verticalPosition: 'top',
            duration: 5000,
          });
        }
      });
    }
  }
}