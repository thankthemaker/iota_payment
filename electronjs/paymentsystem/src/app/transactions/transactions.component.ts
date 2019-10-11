import { Component, OnInit } from '@angular/core';
import { isEqual } from 'lodash';
import { IotaApiService } from '../iotaApi.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { isEmpty } from 'lodash';
import { State } from '../store/store.reducer';
import {
    selectAddressM2MToWatch,
    selectAddressToWatch,
    selectPrice,
    selectTransactionState,
} from '../store/store.selectors';
import {
    setAddressToWatch,
    setAddressM2MToWatch,
    setM2mTransactionState,
    setTransactionState,
} from '../store/store.actions';
import {
    H2M_INITIAL,
    H2M_PAYMENT_ATTACHED,
    H2M_PAYMENT_CONFIRMED, H2M_PAYMENT_REQUESTED,
} from '../store/transactionStatus.constants';
import {
    M2M_INITIAL,
    M2M_PAYMENT_ATTACHED,
    M2M_PAYMENT_CONFIRMED,
    M2M_PAYMENT_REQUESTED,
} from '../store/transactionM2MStatus.constants';
import { Router } from '@angular/router';

const refreshTransactionIntervalSeconds = 15;
const timeoutSeconds = 900;

@Component({
    selector: 'app-transactions',
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent {
    transactions = [];
    transactionTimer: any;
    transactionState;
    transactionState$: Observable<string>;

    address;
    address$: Observable<object>;

    price;
    price$: Observable<number>;

    m2mTransactionTimer: any;
    addressM2M;
    addressM2M$: Observable<object>;

    iotaApi;

    constructor(private store: Store<State>, private iotaApiInj: IotaApiService, private router: Router) {
        this.iotaApi = iotaApiInj;
        this.address$ = store.pipe(selectAddressToWatch);
        this.addressM2M$ = store.pipe(selectAddressM2MToWatch);
        this.address$.subscribe(addressFromStore => {
            if (addressFromStore) {
                console.log('addressToWatch: ', addressFromStore);
                this.address = addressFromStore;
                this.getAddressData();
                let counter =  timeoutSeconds / refreshTransactionIntervalSeconds;
                this.transactionTimer = setInterval(() => {
                    if (counter <= 0) {
                        this.store.dispatch(setAddressToWatch({ addressToWatch: null }));
                        this.store.dispatch(setTransactionState({ transactionState: H2M_INITIAL }));
                        this.router.navigate(['/standby']);
                    } else {
                        this.getAddressData();
                        counter--;
                    }
                }, refreshTransactionIntervalSeconds * 1000);
            } else {
                console.log('clear ');
                clearInterval(this.transactionTimer);
            }
        });
        this.addressM2M$.subscribe(addressM2MFromStore => {
            if (addressM2MFromStore) {
                console.log('addressM2MToWatch: ', addressM2MFromStore);
                this.addressM2M = addressM2MFromStore;
                this.getAddressM2MData();
                let counter =  timeoutSeconds / refreshTransactionIntervalSeconds;
                this.m2mTransactionTimer = setInterval(() => {
                    if (counter <= 0) {
                        this.store.dispatch(setAddressM2MToWatch({ addressM2MToWatch: null }));
                        this.store.dispatch(setM2mTransactionState({ m2mTransactionState: M2M_INITIAL, m2mTransactionValue: 0 }));
                    } else {
                        this.getAddressM2MData();
                        counter--;
                    }
                }, refreshTransactionIntervalSeconds * 1000);
            }
        });
        this.price$ = store.pipe(selectPrice);
        this.price$.subscribe(price => this.price = price);
        this.transactionState$ = store.pipe(selectTransactionState);
        this.transactionState$.subscribe(transactionState => this.transactionState = transactionState);
    }

    ngOnInit() {
    }

    async getAddressData() {
        if (this.address) {
            this.iotaApi.getAddressInfo(this.address).subscribe(async addressData => {
                // prevents unnecessary cycles
                if (!isEmpty(addressData.transactions) && !isEqual(this.transactions, addressData.transactions)) {
                    this.transactions = addressData.transactions;

                    // check iotas-value on all transactions on an address
                    const totalTransactionAmount = addressData.transactions.reduce((a, b) => a + b.value, 0);
                    const confirmedTransactionAmount = addressData.transactions.reduce((a, b) => a + (b.confirmed ? b.value: 0), 0);

                    // remove timer if all transactions confirmed
                    let allTransactionsConfirmed = true;
                    this.transactions.map(transaction => !transaction.confirmed ? allTransactionsConfirmed = false : null);
                    if (confirmedTransactionAmount >= this.price && this.transactionState === H2M_PAYMENT_ATTACHED) {
                        this.store.dispatch(setTransactionState({ transactionState: H2M_PAYMENT_CONFIRMED }));
                        this.store.dispatch(setAddressM2MToWatch({ addressM2MToWatch: this.address }));
                        this.iotaApi.payThirdparty(this.address).subscribe((response) => console.log(response));
                        this.store.dispatch(setM2mTransactionState({ m2mTransactionState: M2M_PAYMENT_REQUESTED, m2mTransactionValue: 0 }));
                        this.store.dispatch(setAddressToWatch({ addressToWatch: null }));
                        clearInterval(this.transactionTimer);
                    } else if (totalTransactionAmount >= this.price && this.transactionState === H2M_PAYMENT_REQUESTED) {
                        this.store.dispatch(setTransactionState({ transactionState: H2M_PAYMENT_ATTACHED }));
                        this.router.navigate(['/brewing']);
                    }
                }
            });
        }
    }

    async getAddressM2MData() {
        if (this.addressM2M) {
            this.iotaApi.getAddressInfo(this.addressM2M).subscribe(addressData => {
                if (addressData.balances.balances[0] === 0) {
                    this.store.dispatch(setM2mTransactionState({ m2mTransactionState: M2M_PAYMENT_CONFIRMED, m2mTransactionValue: 0 }));
                    clearInterval(this.m2mTransactionTimer);
                } else if (!isEmpty(addressData.transactions)) {
                    // check iotas-value on all transactions on an address
                    // if value is null then the transaction to the thirdparty + retained address is attached
                    const totalTransactionValue = addressData.transactions.reduce((a, b) => a + b.value, 0);
                    console.log(`totalTransactionValue [${totalTransactionValue}]`);
                    if(totalTransactionValue === 0) {
                        this.store.dispatch(setM2mTransactionState({ m2mTransactionState: M2M_PAYMENT_ATTACHED, m2mTransactionValue: 0 }));
                    }
                }
            });
        }
    }
}
