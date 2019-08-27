import { Component, OnInit } from '@angular/core';
import { isEqual } from 'lodash';
import { IotaApiService } from '../iotaApi.service';

const refreshTransactionIntervalSeconds = 1000;

@Component({
    selector: 'app-transactions',
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {
    transactions = [];
    transactionTimer: any;
    address = 'HO9WEOIPSJZDYOMIROARQTEMQ9MGNGICWDPXZKBEXCCEU9W9HBYHXEEHVJHAZHKUUGAUGBJYUTTIUXC9XCOIUYRHPB';

    constructor(public iotaApi: IotaApiService) {
    }

    ngOnInit() {
        this.getAddressData();
        this.transactionTimer = setInterval(() => {
            this.getAddressData()
        }, refreshTransactionIntervalSeconds * 1000);
    }

    async getAddressData() {
        if (this.address) {
            this.iotaApi.getAddressInfo(this.address).subscribe(addressData => {
                // prevents flickering on slow devices
                if (!isEqual(this.transactions, addressData.transactions)) {
                    this.transactions = addressData.transactions;
                }
            })
        }
    }
}
