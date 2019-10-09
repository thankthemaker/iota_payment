import { Component } from '@angular/core';
import QRCode from 'qrcode';
import { IotaApiService } from '../iotaApi.service';
import { isEmpty } from 'lodash';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from '../store/store.reducer';
import { setAddressToWatch, setTransactionState } from '../store/store.actions';
import Amplify, { Analytics } from 'aws-amplify';
import { H2M_PAYMENT_ATTACHED, H2M_PAYMENT_REQUESTED } from '../store/transactionStatus.constants';

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
  product = '';
  productcode = '';
  eurs = 0.01;
  iotas = 0;

  constructor(
    private iotaApi: IotaApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store<State>) {}

  ionViewDidEnter() {
    this.product = this.activatedRoute.snapshot.paramMap.get('product');
    this.productcode = this.activatedRoute.snapshot.paramMap.get('productcode');
    this.eurs = Number(this.activatedRoute.snapshot.paramMap.get('price'))/100;
    this.iotaApi.getIotaFromEur(this.eurs).subscribe(response => {
      this.iotas = Math.round(response.MIOTA.price * 1000000);
      this.nextAddress();
      this.displayQrCode();
      this.transactionTimer = setInterval(() => {
        this.getAddressData();
      }, refreshTransactionIntervalSeconds * 1000);
    })
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.qrImage = '';
    this.address = '';
    this.iotas = undefined;
    this.product = '';
    this.productcode = '';
    this.eurs = 0;
    this.transactions = [];
    this.transactionTimer = undefined;
  }

  nextAddress() {
    staticAddress ? this.address = staticAddress :
    this.iotaApi.getNewAddress().subscribe(data => {
      console.log('New address [' + data.index + ']: ' + data.address);
      if (typeof data.address === 'string') {
        this.address = data.address;
        this.processQRCode();
        this.store.dispatch(setAddressToWatch({ addressToWatch: data.address }));
        this.store.dispatch(setTransactionState({ transactionState: H2M_PAYMENT_REQUESTED }));

        Amplify.PubSub.publish('/iota-poc',
        {
          'command': 'hcepayment',
          'product': this.product,
          'price': this.eurs*100,
          'address': data.address,
          'productCode': this.productcode,
          'amountIota': this.iotas
        });
      }
    });
  }

  async getAddressData() {
    if (this.address) {
      this.iotaApi.getAddressInfo(this.address).subscribe(addressData => {
        if (!isEmpty(addressData.transactions)) {
          // check iotas-value on all transactions on an address
          const receivedAmount = addressData.transactions.reduce((a, b) => a + b.value, 0);
          // if value < price show message
          if (receivedAmount >= this.iotas) {
            // prevent double-redirecting
            this.address = undefined;
            clearInterval(this.transactionTimer);
            this.store.dispatch(setTransactionState({ transactionState: H2M_PAYMENT_ATTACHED }));
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
      "amount": ${self.iotas},
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
