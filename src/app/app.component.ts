import { Component } from '@angular/core';
import { ICardInfo } from '@appCore/interfaces';
import { PaymentService } from '@appCore/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})

export class AppComponent {
  publicKey: string;
  cardInfo: ICardInfo;

  constructor(private paymentService: PaymentService) {
    this.publicKey = 'q7nFSA-YbnMWa-rQmamh-Jvm5Ep';
  }

  loadCardInfo(card: ICardInfo) {
    this.cardInfo = card;
  }

  submitPayment() {
    if (this.cardInfo) {
      // this.paymentService.submitPayment(this.cardInfo);
    }
  }
}

