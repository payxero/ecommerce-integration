import { Component } from '@angular/core';

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

  constructor(private paymentService: PaymentService) {
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
      this.paymentService.submitPayment(this.charge);
    }
  }
}
