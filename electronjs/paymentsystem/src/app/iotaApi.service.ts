import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const baseUrl = 'https://iota-api.thank-the-maker.org';

const options = {
    headers: {
        'x-api-key': 'prod-iotapoc-88gbFGg8HoPn2LyNvZcac3NJudd'
    }
};

@Injectable()
export class IotaApiService {
    constructor(private http: HttpClient) {
    }

    getNewAddress() {
        return this.http.post<any>(baseUrl + '/addresses', { seedId: 1}, options);
    }

    getAddressInfo(address) {
        return this.http.get<any>(baseUrl + '/addresses' + '/' + address, options);
    }

    getSeedInfo() {
        return this.http.get<any>(baseUrl + '/seeds' + '/' + '1', options);
    }

    getNodeInfo() {
        return this.http.get<any>(baseUrl + '/nodes', options);
    }

    getIotaFromEur(eurs) {
        return this.http.get<any>(baseUrl + '/market/price-conversion/EUR/' + eurs, options);
    }
}
