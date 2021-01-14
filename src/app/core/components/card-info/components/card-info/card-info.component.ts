import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    OnDestroy,
    OnInit,
    Output,
    Renderer2,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subject } from 'rxjs';
import * as _ from 'lodash';

import { ICardInfo } from '../../../../interfaces';

@Component({
    selector: 'app-card-info',
    templateUrl: './card-info.component.html',
    styleUrls: ['./card-info.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class CardInfoComponent implements OnInit, OnDestroy, AfterViewInit {

    cardForm: FormGroup;

    @Input() publicKey: string;
    @Output() onLoadCard: EventEmitter<ICardInfo>;
    @Output() onSendLoading: EventEmitter<boolean>;
    @Output() onValidForm: EventEmitter<boolean>;

    cardErrorMsg = [];

    validCard = {
        ccnumber: false,
        ccexp: false,
        cvv: false
    };
    cardInfo: ICardInfo;

    @ViewChild('script') script: ElementRef;
    @ViewChild('scriptCollect') scriptCollect: ElementRef;

    @ViewChild('demoCcnumber') demoCcnumber: ElementRef;
    @ViewChild('demoCcexp') demoCcexp: ElementRef;
    @ViewChild('demoCvv') demoCvv: ElementRef;

    @ViewChild('buttonCard') buttonCard: ElementRef;

    // Private
    private _unsubscribeAll: Subject<any>;
    tokenization: Subject<boolean>;

    loadExternalCollectJs: boolean;

    /**
     * Constructor
     *
     * @param {FormBuilder} _formBuilder
     * @param {Renderer2} _renderer2
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _renderer2: Renderer2,
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.tokenization = new Subject();
        this.loadExternalCollectJs = false;
        this.onLoadCard = new EventEmitter();
        this.onSendLoading = new EventEmitter();
        this.onValidForm = new EventEmitter();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.cardForm = this.createCardForm();
    }

    ngAfterViewInit(): void {
        this.loadScriptJS();
    }

    loadScriptJS(): void {
        this.loadExternalCollectJs = false;

        this._renderer2.setProperty(this.scriptCollect.nativeElement, 'innerHTML', '');
        const script = this._renderer2.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.text = `
                      function loadCallScriptCollectJS(){
                          var event = new CustomEvent("CallScriptCollectJS",{});
                          window.dispatchEvent(event);
                      }`;
        this.scriptCollect.nativeElement.appendChild(script);

        const scriptLoad = this._renderer2.createElement('script');
        scriptLoad.setAttribute('type', 'text/javascript');
        scriptLoad.setAttribute('src', 'https://secure.networkmerchants.com/token/Collect.js');
        scriptLoad.setAttribute('data-tokenization-key', this.publicKey);

        scriptLoad.setAttribute('onload', 'loadCallScriptCollectJS()');

        scriptLoad.async = true;

        this._renderer2.setProperty(this.scriptCollect.nativeElement, 'innerHTML', '');


        this.scriptCollect.nativeElement.appendChild(scriptLoad);
    }

    loadScriptCollectJS(): void {
        if (!this.loadExternalCollectJs) { return; }

        this._renderer2.setProperty(this.demoCcnumber.nativeElement, 'innerHTML', '');
        this._renderer2.setProperty(this.demoCcexp.nativeElement, 'innerHTML', '');
        this._renderer2.setProperty(this.demoCvv.nativeElement, 'innerHTML', '');
        this.validCard = {
            ccnumber: false,
            ccexp: false,
            cvv: false
        };

        const scriptConfig = this._renderer2.createElement('script');
        scriptConfig.setAttribute('type', 'text/javascript');
        scriptConfig.text = `
            CollectJS.configure({
                "paymentSelector" : "#payButton",
                "variant" : "inline",
                "styleSniffer" : "true",
                "googleFont": "Montserrat:400",
                "customCss" : {
                    "color": "black",
                    "background-color": "white"
                },
                "invalidCss": {
                    "color": "red",
                    "background-color": "white"
                },
                "validCss": {
                    "color": "black",
                    "background-color": "white"
                },
                "placeholderCss": {
                    "color": "#b3b3b3",
                    "background-color": "white",
                },
                "focusCss": {
                    "color": "black",
                    "background-color": "white"
                },
                "fields": {
                    "ccnumber": {
                        "selector": "#demoCcnumber",
                        "title": "Card Number",
                        "placeholder": "0000 0000 0000 0000"
                    },
                    "ccexp": {
                        "selector": "#demoCcexp",
                        "title": "Card Expiration",
                        "placeholder": "mm/yyyy"
                    },
                    "cvv": {
                        "display": "show",
                        "selector": "#demoCvv",
                        "title": "CVV Code",
                        "placeholder": "000"
                    },
                },
                'validationCallback' : function(field, status, message, response) {
                    var event = new CustomEvent("CallValidationCard", {
                        detail: {'field': field ,'status': status ,'message': message, 'value': response}
                      });
                    window.dispatchEvent(event);
                },
                'timeoutDuration' : 10000,
                'callback' : function(response) {
                    var event = new CustomEvent("CallSetToken", {
                        detail: {
                             token: response.token,
                             card: response.card,
                             }
                      });
                    window.dispatchEvent(event);
                }
            });`;

        this._renderer2.setProperty(this.script.nativeElement, 'innerHTML', '');
        this.script.nativeElement.appendChild(scriptConfig);
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create payment form
     *
     * @returns {FormGroup}
     */
    createCardForm(): FormGroup {

        return this._formBuilder.group({
            name: ['', [Validators.required, Validators.pattern('^[\\X*\\D]*$')]],
            zipCode: ['', [Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')]],
            cardNumber: [''],
            expDate: [''],
            cardCVV: [''],
            paymentToken: [null, Validators.required],
        });
    }

    @HostListener('window:CallValidationCard', ['$event', '$event.detail'])
    onCallValidationCard(event, detail): void {
        this.setPaymentToken(null);

        const field = _.get(detail, 'field');
        const status = _.get(detail, 'status');

        let message = '';
        const fields = {
            ccnumber: 'cardNumber',
            ccexp: 'expDate',
            cvv: 'cardCVV'
        };

        let error = null;
        if (!status) {
            error = { error: true };
            message = _.get(detail, 'message');
        }

        this.cardForm.controls[fields[field]].setErrors(error);
        this.cardForm.controls[fields[field]].markAsTouched();
        if (message === 'Field is empty') {
            this.cardErrorMsg[fields[field]] = `${this.getFieldName(field)} is required`;
        } else {
            this.cardErrorMsg[fields[field]] = message;
        }

        this.cardForm.controls['paymentToken'].setValue(null);
        this.cardForm.controls['paymentToken'].markAsTouched();

        this.validCard[field] = status;
        if (this.validCard['ccnumber'] && this.validCard['ccexp'] && this.validCard['cvv']) {
            this.buttonCard.nativeElement.click();
            this.tokenization.next(true);
            this.onValidForm.emit(true);
            this.onSendLoading.emit(!this.cardInfo);
        } else {
            this.onValidForm.emit(false);
        }
    }

    @HostListener('window:CallSetToken', ['$event', '$event.detail'])
    onCallSetToken(event, detail): void {
        this.setPaymentToken(_.get(detail, 'token'));

        const card = _.get(detail, 'card');
        const { name, zipCode } = this.cardForm.getRawValue();
        this.cardInfo = {
            bin: _.get(card, 'bin'),
            number: _.get(card, 'number'),
            network: _.get(card, 'type'),
            exp: _.get(card, 'exp'),
            paymentToken: _.get(detail, 'token'),
            ...(!_.isNil(name) && { name }),
            ...(!_.isNil(zipCode) && { zipCode }),
        } as ICardInfo;
        this.onLoadCard.emit(this.cardInfo);
        this.tokenization.next(false);
        this.onSendLoading.emit(false);
    }

    @HostListener('window:CallScriptCollectJS', ['$event'])
    onCallScriptCollectJS(event, detail): void {
        setTimeout(
            () => {
                this.loadExternalCollectJs = true;
                this.loadScriptCollectJS();
            }, 500);
    }

    setPaymentToken(paymentToken: string): void {
        this.cardForm.controls['paymentToken'].setValue(paymentToken);
        this.cardForm.controls['paymentToken'].markAsTouched();
    }

    validateForm(): void {
        const fields = {
            ccnumber: 'cardNumber',
            ccexp: 'expDate',
            cvv: 'cardCVV'
        };
        _.each(['ccnumber', 'ccexp', 'cvv'], (field) => {
            if (!this.validCard[field]) {
                this.cardForm.controls[fields[field]].setErrors({ error: true });
                this.cardForm.controls[fields[field]].markAsTouched();
                this.cardErrorMsg[fields[field]] = `${this.getFieldName(field)} is required`;
            }
        });
        this.cardForm.controls['name'].markAsTouched({ onlySelf: true });
        this.cardForm.controls['zipCode'].markAsTouched({ onlySelf: true });
        this.cardForm.updateValueAndValidity();
    }

    getFieldName(field: string): string {
        switch (field) {
            case 'ccnumber':
                return 'Card Number';
            case 'ccexp':
                return 'Exp. Date';
            case 'cvv':
                return 'CVV/CVC';
            default:
                return field;
        }
    }

}

