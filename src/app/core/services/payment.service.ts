import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class PaymentService {

    apiUrl: string;

    constructor(
        private readonly http: HttpClient,

    ) {
        this.apiUrl = 'http://localhost:3000/payment';
    }

    submitPayment(charge: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.post(`${this.apiUrl}/charge`, charge).subscribe(resolve, reject);
        });
    }

    submitRate(info: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.get(`${this.apiUrl}/rate`,
                {
                    params: {
                        binCard: (info.card.bin as string).slice(0, 6),
                        amount: info.amount,
                        ...(info?.card?.paymentToken) && { tokenId: info.card.paymentToken }
                    }
                }).subscribe(resolve, reject);
        });
    }

}
