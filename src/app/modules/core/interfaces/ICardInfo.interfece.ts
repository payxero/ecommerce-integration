export interface ICardInfo {
    name?: string;
    bin?: string;

    type?: string;
    network?: string;

    paymentToken?: string;
    vaultId?: string;

    number?: string;
    last4?: string;

    cvc?: number;
    exp_month?: number;
    exp_year?: number;
    exp?: string;
    zipCode?: string;
}
