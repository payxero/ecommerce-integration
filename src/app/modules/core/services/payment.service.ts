import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { ICardInfo } from '@appCore/interfaces/ICardInfo.interfece';

@Injectable({
    providedIn: 'root',
})
export class PaymentService {

    url: string;
    paymentToken: string;

    constructor(private readonly http: HttpClient) {}

    submitPayment(card: ICardInfo): Observable<any> {
        return this.http.post(`${this.url}/charge`, card);
    }

}