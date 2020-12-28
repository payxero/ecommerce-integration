import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Apollo, ApolloBase, gql } from 'apollo-angular';

@Injectable({
    providedIn: 'root',
})
export class PaymentService {

    url: string;
    paymentToken: string;
    private apollo: ApolloBase;

    constructor(
        private readonly http: HttpClient,
        private apolloProvider: Apollo,
        private matSnackBar: MatSnackBar,

    ) {
        this.apollo = this.apolloProvider.use('payment');
    }

    submitPayment(charge: any) {
        this.apollo.mutate({
            mutation: gql`
                mutation charge($chargeData: ChargeInput!) {
                    charge(chargeData: $chargeData) {
                        transactionId
                    }
                }
            `,
            variables: {
                chargeData: charge,
            },
        }).subscribe((res) => {
            this.matSnackBar.open(`Transaction Success`, 'OK', {
                verticalPosition: 'top',
                duration: 5000,
            });
        },(error) => {
            this.matSnackBar.open(`There was an error sending the query ${error}`, 'OK', {
                verticalPosition: 'top',
                duration: 5000,
            });
        });
    }

}
