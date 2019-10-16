import { Component } from '@angular/core';
import QRCode from 'qrcode';
import { IotaApiService } from '../iotaApi.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from '../store/store.reducer';
import { setAddressToWatch, setPrice, setTransactionState } from '../store/store.actions';
import Amplify from 'aws-amplify';
import { H2M_PAYMENT_REQUESTED } from '../store/transactionStatus.constants';

// For testing:
// const staticAddress ='HO9WEOIPSJZDYOMIROARQTEMQ9MGNGICWDPXZKBEXCCEU9W9HBYHXEEHVJHAZHKUUGAUGBJYUTTIUXC9XCOIUYRHPB';
const staticAddress = undefined;

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
      this.store.dispatch(setPrice({ price: this.iotas }))
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
