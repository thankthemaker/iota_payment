import { Component } from '@angular/core';
import { IotaApiService } from '../iotaApi.service';

const refresDataInMinutes = 10;

@Component({
    selector: 'app-marketdata',
    templateUrl: './marketdata.component.html',
    styleUrls: ['./marketdata.component.scss'],
})
export class MarketdataComponent {
    marketDataTimer: any;
    iotaQuotes = {};

    constructor(private iotaApi: IotaApiService) {
        this.updateMarketdata();
        this.marketDataTimer = setInterval(() => {
            this.updateMarketdata();
        }, refresDataInMinutes * 60 * 1000);
    }

    updateMarketdata() {
        this.iotaApi.getIotaQuotes().subscribe(response => {
            this.iotaQuotes = response;
        });
    }

    getSign = value => {
        const priceSign = '';
        if (Math.sign(value) > 0) {
            return '+'
        }
        if (Math.sign(value) < 0) {
            return '-'
        }
        return '';
    }
}
