import { Component } from '@angular/core';
import { IotaApiService } from '../iotaApi.service';
import { Observable } from 'rxjs';
import { selectM2mTransactionState, selectTransactionState } from '../store/store.selectors';
import { Store } from '@ngrx/store';
import { State } from '../store/store.reducer';
import { H2M_PAYMENT_CONFIRMED } from '../store/transactionStatus.constants';
import { M2M_PAYMENT_CONFIRMED } from '../store/transactionM2MStatus.constants';

const refresDataInMinutes = 60;

@Component({
    selector: 'app-balanceinfo',
    templateUrl: './balanceinfo.component.html',
    styleUrls: ['./balanceinfo.component.scss'],
})
export class BalanceinfoComponent {
    balanceInfoTimer: any;
    seed2balance;
    seed3balance;
    seed2balanceEur;
    seed3balanceEur;

    h2mTransactionState$: Observable<string>;
    m2mTransactionState$: Observable<string>;

    constructor(private store: Store<State>, private iotaApi: IotaApiService) {
        this.updateBalanceinfo();
        this.balanceInfoTimer = setInterval(() => {
            this.updateBalanceinfo();
        }, refresDataInMinutes * 60 * 1000);
        this.h2mTransactionState$ = this.store.pipe(selectTransactionState);
        this.h2mTransactionState$.subscribe(transactionStateFromStore => {
            if (transactionStateFromStore === H2M_PAYMENT_CONFIRMED) {
                this.updateBalanceinfo();
            }
        });
        this.m2mTransactionState$ = this.store.pipe(selectM2mTransactionState);
        this.m2mTransactionState$.subscribe(transactionStateFromStore => {
            if (transactionStateFromStore === M2M_PAYMENT_CONFIRMED) {
                this.updateBalanceinfo();
            }
        });
    }

    updateBalanceinfo() {
        this.iotaApi.getIotaQuotes().subscribe(quotes => {
            this.iotaApi.getSeedInfo(2).subscribe(response => {
                this.seed2balance = response.totalBalance;
                this.seed2balanceEur = response.totalBalance / 1000000 * quotes.price;
            });
            this.iotaApi.getSeedInfo(3).subscribe(response => {
                this.seed3balance = response.totalBalance;
                this.seed3balanceEur = response.totalBalance / 1000000 * quotes.price;
            });
        })
    }
}
