import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class PaymentService {

    url: string;

    constructor(
        private readonly http: HttpClient,

    ) {
        this.url = 'https://api.zerospay.com/v1/public/payment';
    }

    submitPayment(charge: any): Promise<any> {
        const data = {
            query: `mutation charge(
                $clientId: ID!,
                $token: String,
                $amount: Float!,
                $surcharge: Float!,
                $currency: String,
                $card: CardInput!,
                $contact: ContactInput!,
                $billingAddress: AddressInput!,
                $shippingAddress: AddressInput!,
                $order: OrderInput!,
                $sendReceipt: Boolean,
                $capture: Boolean!,
                $paymentRequestId: String,
                $percent: Float,
                $from: String,
                $fromId: String
              ){
                charge(chargeData:{
                clientId: $clientId,
                token: $token,
                amount: $amount,
                surcharge: $surcharge,
                currency: $currency,
                card: $card,
                contact: $contact,
                billingAddress: $billingAddress,
                shippingAddress: $shippingAddress,
                order: $order,
                sendReceipt: $sendReceipt,
                capture: $capture,
                paymentRequestId: $paymentRequestId,
                percent: $percent,
                from: $from,
                fromId: $fromId
              }){
                transactionId
              }
            }`,
            variables: charge
        };
        return new Promise((resolve, reject) => {
            this.http.post(this.url, data).subscribe(resolve, reject);
        });
    }

}
