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
        // Polling is necessary, because aws gateway limits requests to 30seconds
        this.iotaApi.getIotaQuotes().subscribe(quotes => {
            this.iotaApi.updateSeedInfo(1).subscribe(() => {
                const timer = setInterval(() => {
                    this.iotaApi.getSeedInfo(1).subscribe(infos => {
                        if (infos.updateState === 'COMPLETED') {
                            this.seed2balance = infos.balance;
                            this.seed2balanceEur = infos.balance / 1000000 * quotes.price;
                            clearInterval(timer);
                        }
                    });
                }, 5000);
            });
            this.iotaApi.updateSeedInfo(3).subscribe(() => {
                const timer = setInterval(() => {
                    this.iotaApi.getSeedInfo(3).subscribe(infos => {
                        if (infos.updateState === 'COMPLETED') {
                            this.seed3balance = infos.balance;
                            this.seed3balanceEur = infos.balance / 1000000 * quotes.price;
                            clearInterval(timer);
                        }
                    });
                }, 5000);
            });
        })
    }
}
