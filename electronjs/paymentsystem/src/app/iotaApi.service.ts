import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const baseUrl = 'https://iota-api.thank-the-maker.org';

const options = {
    headers: {
        'x-api-key': 'CiZ9mapceb5pQXFsvNx1q4mHqYrZVWN8SScTzrzc'
    }
};

@Injectable()
export class IotaApiService {
    constructor(private http: HttpClient) {
    }

    payThirdparty = address => this.http.post<any>(baseUrl + '/addresses' + '/' + address + '/paythirdparty', null, options);

    getNewAddress = () => this.http.post<any>(baseUrl + '/addresses', {seedId: 1}, options);

    getAddressInfo = address => this.http.get<any>(baseUrl + '/addresses' + '/' + address, options);

    getSeedInfo = () => this.http.get<any>(baseUrl + '/seeds' + '/' + '1', options);

    getNodeInfo = () => this.http.get<any>(baseUrl + '/nodes', options);

    getIotaFromEur = eurs => this.http.get<any>(baseUrl + '/market/price-conversion/EUR/' + eurs, options);
}
