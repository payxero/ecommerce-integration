import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import * as _ from 'lodash';

import { ICardInfo } from './core/interfaces';
import { PaymentService } from './core/services';
import { chargeData } from './core/utils/chargeData';

@Component({
    selector: 'app-root',
    styleUrls: ['./app.component.scss'],
    templateUrl: './app.component.html',
})

export class AppComponent implements OnInit {
    publicKey: string;
    cardInfo: ICardInfo;
    charge: any;
    loading = false;
    isValid = false;
    customerFee = 0;
    totalAmount = 0;
    paymentForm: FormGroup;

    showCardInfo = false;

    constructor(
        private paymentService: PaymentService,
        private matSnackBar: MatSnackBar,
        private _formBuilder: FormBuilder,

    ) {
        this.publicKey = '2TQdje-6MfPE8-NSUa5B-B44w5K';
    }

    /**
    * On init
    */
    ngOnInit(): void {
        this.paymentForm = this._formBuilder.group({
            amount: [null, [Validators.required, Validators.min(0.01)]],
        });
    }

    public nextAmount(): void {
        this.paymentForm.valid
        if (this.isFormValid(this.paymentForm)) {
            this.showCardInfo = true;

            this.paymentForm.disable();
        }
    }

    public userThisCard(): void {
        if (this.cardInfo && this.isValid) {
            this.charge.amount = this.paymentForm.controls['amount'].value * 100;
            this.loading = true;
            this.paymentService.submitRate(this.charge).then(response => {
                if (_.hasIn(response, 'errors') && !_.isNil(response.errors)) {
                    const message = response.errors[0].message;
                    this.matSnackBar.open(`There was an error sending the query. ${message}`, 'OK', {
                        verticalPosition: 'top',
                        duration: 5000,
                    });
                    this.loading = false;
                } else {
                    this.customerFee = _.get(response.data, 'surcharge');
                    this.totalAmount = _.get(response.data, 'totalAmount');
                    this.charge.surcharge = this.customerFee;
                    this.matSnackBar.open(`Success calculate rate`, 'OK', {
                        verticalPosition: 'top',
                        duration: 5000,
                    });
                    this.loading = false;
                }
            });
        }
    }

    loadCardInfo(card: ICardInfo): void {
        const zip = _.get(card, 'zipCode');
        this.cardInfo = _.omit(card, ['zipCode']);
        this.charge = chargeData;
        this.charge.card = this.cardInfo;
        this.charge.billingAddress.zipCode = zip;
    }

    submitPayment(): void {
        if (this.cardInfo && this.isValid) {
            this.loading = true;
            this.paymentService.submitPayment(this.charge).then(response => {
                if (_.hasIn(response, 'errors') && !_.isNil(response.errors)) {
                    const message = response.errors[0].message;
                    this.matSnackBar.open(`There was an error sending the query. ${message}`, 'OK', {
                        verticalPosition: 'top',
                        duration: 5000,
                    });
                    this.loading = false;
                } else {
                    const transaction = _.get(response.data, 'transactionId');
                    this.matSnackBar.open(`Transaction ${transaction} Success`, 'OK', {
                        verticalPosition: 'top',
                        duration: 5000,
                    });
                    this.loading = false;
                }
            }).catch(e => {
                this.matSnackBar.open(`Error payment. Please try again`, 'OK', {
                    verticalPosition: 'top',
                    duration: 5000,
                });
            }).finally(() => {
                setTimeout(() => { location.reload(); }, 7000);
            });
        }
    }

    private isFormValid(form: FormGroup | FormControl): boolean {
        form.updateValueAndValidity();
        form.markAllAsTouched();

        return form.valid;
    }

}
