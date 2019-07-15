import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const addressesUrl = 'https://iota-api.thank-the-maker.org/addresses';

@Injectable()
export class IotaApiService {
    constructor(private http: HttpClient) {
    }

    getNewAddress() {
        return this.http.post<any>(addressesUrl, null);
    }

    getAddressInfo(address) {
        return this.http.get<any>(addressesUrl + '/' + address)
    }
}
