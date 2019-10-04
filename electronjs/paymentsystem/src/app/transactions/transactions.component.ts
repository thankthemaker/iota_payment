import { Component, OnInit } from '@angular/core';
import { isEqual } from 'lodash';
import { IotaApiService } from '../iotaApi.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '../store/store.reducer';
import { selectAddressM2MToWatch, selectAddressToWatch } from '../store/store.selectors';
import {
    setAddressToWatch,
    setAddressM2MToWatch,
    setM2mTransactionState,
    setTransactionState,
} from '../store/store.actions';
import { H2M_INITIAL, H2M_PAYMENT_CONFIRMED, H2M_PAYMENT_REQUESTED } from '../store/transactionStatus.constants';
import { M2M_PAYMENT_CONFIRMED, M2M_PAYMENT_REQUESTED } from '../store/transactionM2MStatus.constants';

const refreshTransactionIntervalSeconds = 10;

@Component({
    selector: 'app-transactions',
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent {
    transactions = [];
    transactionTimer: any;
    address;
    address$: Observable<object>;

    m2mTransactionTimer: any;
    addressM2M;
    addressM2M$: Observable<object>;

    iotaApi;

    constructor(private store: Store<State>, private iotaApiInj: IotaApiService) {
        this.iotaApi = iotaApiInj;
        this.address$ = store.pipe(selectAddressToWatch);
        this.addressM2M$ = store.pipe(selectAddressM2MToWatch);
        this.address$.subscribe(addressFromStore => {
            if (addressFromStore) {
                console.log('addressToWatch: ', addressFromStore);
                this.address = addressFromStore;
                this.getAddressData();
                this.transactionTimer = setInterval(() => {
                    this.getAddressData();
                }, refreshTransactionIntervalSeconds * 1000);
            }
        });
        this.addressM2M$.subscribe(addressM2MFromStore => {
            if (addressM2MFromStore) {
                console.log('addressM2MToWatch: ', addressM2MFromStore);
                this.addressM2M = addressM2MFromStore;
                this.getAddressM2MData();
                this.m2mTransactionTimer = setInterval(() => {
                    this.getAddressM2MData();
                }, refreshTransactionIntervalSeconds * 1000);
            }
        });
    }

    ngOnInit() {
    }

    async getAddressData() {
        if (this.address) {
            this.iotaApi.getAddressInfo(this.address).subscribe(async addressData => {
                // prevents unnecessary cycles
                if (!isEqual(this.transactions, addressData.transactions)) {
                    this.transactions = addressData.transactions;
                    // remove timer if all transactions confirmed
                    let allTransactionsConfirmed = true;
                    this.transactions.map(transaction => !transaction.confirmed ? allTransactionsConfirmed = false : null);
                    if (allTransactionsConfirmed) {
                        this.store.dispatch(setTransactionState({ transactionState: H2M_PAYMENT_CONFIRMED }));
                        this.store.dispatch(setAddressM2MToWatch({ addressM2MToWatch: this.address }));
                        this.iotaApi.payThirdparty(this.address).subscribe((response) => console.log(response));
                        this.store.dispatch(setM2mTransactionState({ m2mTransactionState: M2M_PAYMENT_REQUESTED, m2mTransactionValue: 0 }));
                        this.store.dispatch(setAddressToWatch({ addressToWatch: null }));
                        clearInterval(this.transactionTimer);
                    }
                }
            });
        }
    }

    async getAddressM2MData() {
        if (this.addressM2M) {
            this.iotaApi.getAddressInfo(this.addressM2M).subscribe(addressData => {
                if(addressData) {
                    if (addressData.balances.balances[0] === 0) {
                        this.store.dispatch(setM2mTransactionState({ m2mTransactionState: M2M_PAYMENT_CONFIRMED, m2mTransactionValue: 0 }))
                        clearInterval(this.m2mTransactionTimer);
                    }
                }
            });
        }
    }
}
