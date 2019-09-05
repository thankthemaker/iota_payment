import { Component } from '@angular/core';
import QRCode from 'qrcode';
import { IotaApiService } from '../iotaApi.service';
import { isEmpty } from 'lodash';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from '../store/store.reducer';
import { setAddressToWatch } from '../store/store.actions';

// For testing:
// const staticAddress ='HO9WEOIPSJZDYOMIROARQTEMQ9MGNGICWDPXZKBEXCCEU9W9HBYHXEEHVJHAZHKUUGAUGBJYUTTIUXC9XCOIUYRHPB';
const staticAddress = undefined;
const refreshTransactionIntervalSeconds = 5;

@Component({
  selector: 'app-payment',
  templateUrl: 'payment.page.html',
  styleUrls: ['payment.page.scss'],
})
export class PaymentPage {
  qrImage = '';
  address = '';
  text = '';
  transactions = [];
  transactionTimer: any;
  // the amount shoud be transfered by the coffee-machine
  amount = 0;
  product = '';


  constructor(
    private iotaApi: IotaApiService, 
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    private store: Store<State>) {}

  ionViewDidEnter() {
    this.nextAddress();
    this.displayQrCode();
    this.transactionTimer = setInterval(() => {
      this.getAddressData();
    }, refreshTransactionIntervalSeconds * 1000);
  }

  ngOnInit() {
    this.product = this.activatedRoute.snapshot.paramMap.get('product');
    this.amount = Number(this.activatedRoute.snapshot.paramMap.get('price'));
  }

  ngOnDestroy() {
    this.qrImage = '';
    this.address = '';
    this.transactions = [];
    this.transactionTimer = undefined;
  }

  nextAddress() {
    staticAddress ? this.address = staticAddress :
    this.iotaApi.getNewAddress().subscribe(data => {
      console.log('New address [' + data.index + ']: ' + data.address);
      if (typeof data.address === 'string') {
        this.address = data.address;
        this.store.dispatch(setAddressToWatch({ addressToWatch: data.address }));
        this.processQRCode();
      }
    });
  }

  async getAddressData() {
    if (this.address) {
      this.iotaApi.getAddressInfo(this.address).subscribe(addressData => {
        if (!isEmpty(addressData.transactions)) {
          // check amount-value on all transactions on an address
          const receivedAmount = addressData.transactions.reduce((a, b) => a + b.value, 0);
          if (receivedAmount >= this.amount) {
            // prevent double-redirecting
            this.address = undefined;
            this.router.navigate(['/brewing']);
          }
        }
      });
    }
  }

  displayQrCode() {
    return this.qrImage !== '';
  }

  processQRCode() {
    const qrcode = QRCode;
    const self = this;
    qrcode.toDataURL(`{
      "address": "${self.address}",
      "amount": ${self.amount},
      "message": "",
      "tag": ""
    }`, {
      errorCorrectionLevel: 'H',
      colorDark : '#00357a',
      colorLight : '#fecb0a',
     }, function(err, url) {
      self.qrImage = url;
    });
  }
}
