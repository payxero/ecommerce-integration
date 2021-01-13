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
        this.apiUrl = 'http://localhost:3000/payment/charge';
    }

    submitPayment(charge: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.http.post(this.apiUrl, charge).subscribe(resolve, reject);
        });
    }

}
