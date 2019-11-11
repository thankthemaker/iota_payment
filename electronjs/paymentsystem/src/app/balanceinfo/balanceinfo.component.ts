import { Component } from '@angular/core';
import { IotaApiService } from '../iotaApi.service';
import { Observable } from 'rxjs';
import { selectM2mTransactionState, selectTransactionState } from '../store/store.selectors';
import { Store } from '@ngrx/store';
import { State } from '../store/store.reducer';
import { H2M_PAYMENT_CONFIRMED } from '../store/transactionStatus.constants';
import { M2M_PAYMENT_CONFIRMED } from '../store/transactionM2MStatus.constants';

const refresDataInMinutes = 120;

@Component({
    selector: 'app-balanceinfo',
    templateUrl: './balanceinfo.component.html',
    styleUrls: ['./balanceinfo.component.scss'],
})
export class BalanceinfoComponent {
    m2mbalanceInfoTimer: any;
    h2mbalanceInfoTimer: any;
    seed1balance;
    seed1balanceEur;
    seed2balance;
    seed2balanceEur;
    seed3balance;
    seed3balanceEur;

    h2mTransactionState$: Observable<string>;
    m2mTransactionState$: Observable<string>;

    constructor(private store: Store<State>, private iotaApi: IotaApiService) {
        this.updateH2MBalanceinfo();
        this.h2mbalanceInfoTimer = setInterval(() => {
            this.updateH2MBalanceinfo();
        }, refresDataInMinutes * 60 * 1000);
        this.h2mTransactionState$ = this.store.pipe(selectTransactionState);
        this.h2mTransactionState$.subscribe(transactionStateFromStore => {
            if (transactionStateFromStore === H2M_PAYMENT_CONFIRMED) {
                this.updateH2MBalanceinfo();
            }
        });

        this.updateM2MBalanceinfo();
        this.m2mbalanceInfoTimer = setInterval(() => {
            this.updateM2MBalanceinfo();
        }, refresDataInMinutes * 60 * 1000);
        this.m2mTransactionState$ = this.store.pipe(selectM2mTransactionState);
        this.m2mTransactionState$.subscribe(transactionStateFromStore => {
            if (transactionStateFromStore === M2M_PAYMENT_CONFIRMED) {
                this.updateM2MBalanceinfo();
            }
        });
    }

    updateH2MBalanceinfo() {
        // Polling is necessary, because aws gateway limits requests to 30seconds
        this.iotaApi.getIotaQuotes().subscribe(quotes => {
            this.iotaApi.updateSeedInfo(1).subscribe(() => {
                const timer = setInterval(() => {
                    this.iotaApi.getSeedInfo(1).subscribe(infos => {
                        if (infos.updateState === 'COMPLETED') {
                            this.seed1balance = infos.balance;
                            this.seed1balanceEur = infos.balance / 1000000 * quotes.price;
                            clearInterval(timer);
                        }
                    });
                }, 5000);
            });
        })
    }

    updateM2MBalanceinfo() {
        // Polling is necessary, because aws gateway limits requests to 30seconds
        this.iotaApi.getIotaQuotes().subscribe(quotes => {
            this.iotaApi.updateSeedInfo(1).subscribe(() => {
                const timer = setInterval(() => {
                    this.iotaApi.getSeedInfo(1).subscribe(infos => {
                        if (infos.updateState === 'COMPLETED') {
                            this.seed1balance = infos.balance;
                            this.seed1balanceEur = infos.balance / 1000000 * quotes.price;
                            clearInterval(timer);
                        }
                    });
                }, 5000);
            });
            this.iotaApi.updateSeedInfo(2).subscribe(() => {
                const timer = setInterval(() => {
                    this.iotaApi.getSeedInfo(2).subscribe(infos => {
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
