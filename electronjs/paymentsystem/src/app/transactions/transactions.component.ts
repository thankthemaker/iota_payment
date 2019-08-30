import { Component, OnInit } from '@angular/core';
import { isEqual } from 'lodash';
import { IotaApiService } from '../iotaApi.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '../store/store.reducer';
import { selectAddressToWatch } from '../store/store.selectors';

let refreshTransactionIntervalSeconds = 10;

@Component({
    selector: 'app-transactions',
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {
    transactions = [];
    transactionTimer: any;
    address;

    address$: Observable<object>;

    constructor(private store: Store<State>, private iotaApi: IotaApiService) {
        this.address$ = store.pipe(selectAddressToWatch);
        this.address$.subscribe(addressFromStore => {
            console.log('addressToWatch: ', addressFromStore);
            this.address = addressFromStore
        });
    }

    ngOnInit() {
        this.getAddressData();
        this.transactionTimer = setInterval(() => {
            this.getAddressData();
        }, refreshTransactionIntervalSeconds * 1000);
    }

    async getAddressData() {
        if (this.address) {
            this.iotaApi.getAddressInfo(this.address).subscribe(addressData => {
                // prevents unnecessary cycles
                if (!isEqual(this.transactions, addressData.transactions)) {
                    this.transactions = addressData.transactions;
                    // remove timer if all transactions confirmed
                    let allTransactionsConfirmed = true;
                    this.transactions.map(transaction => !transaction.confirmed ? allTransactionsConfirmed = false : null);
                    if (allTransactionsConfirmed) {
                        clearInterval(this.transactionTimer);
                    }
                }
            });
        }
    }
}
