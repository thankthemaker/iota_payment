import { Component } from '@angular/core';
import QRCode from 'qrcode';
import { IotaApiService } from '../iotaApi.service';
import { isEmpty } from 'lodash';
import { Router } from '@angular/router';
import Amplify, { PubSub } from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub/lib/Providers';
import { AWS } from '@aws-amplify/core';
import { environment } from '../../environments/environment';


// For testing:
//const staticAddress ='HO9WEOIPSJZDYOMIROARQTEMQ9MGNGICWDPXZKBEXCCEU9W9HBYHXEEHVJHAZHKUUGAUGBJYUTTIUXC9XCOIUYRHPB';
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
  amount = 3;

  constructor(public iotaApi: IotaApiService, private router: Router) {

    AWS.config.update({
      credentials: new AWS.Credentials ({
        accessKeyId: environment.accessKeyId,
        secretAccessKey: environment.secretAccessKey
      })
    })


    /*
    Amplify.configure({
      Auth: {
        // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
        identityPoolId: 'eu-central-1:bc2800e6-e443-4fa2-9cd1-efda00815ee3',
  
        // REQUIRED - Amazon Cognito Region
        region: 'eu-central-1',
  
        // OPTIONAL - Amazon Cognito User Pool ID
        userPoolId: 'eu-central-1_uw9fILjMv',
  
        // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
        userPoolWebClientId: '767s22a9vjc7qopt2su5qpmv07',
  
        // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
        mandatorySignIn: true,
      }
    });  
*/
    // Apply plugin with configuration
//    Amplify.addPluggable(new AWSIoTProvider({
//      aws_pubsub_region: 'eu-central-1',
//      aws_pubsub_endpoint: 'wss://a3dtjrh1oco8co-ats.iot.eu-central-1.amazonaws.com/mqtt',
//    }));
  }

  ionViewDidEnter() {
    this.nextAdress();
    this.displayQrCode();
    this.transactionTimer = setInterval(() => {
      this.getAddressData()
    }, refreshTransactionIntervalSeconds * 1000);
  }

  ngOnDestroy() {
    this.qrImage = '';
    this.address = '';
    this.transactions = [];
    this.transactionTimer = undefined;
  }

  nextAdress() {
    process();
    /*
    staticAddress ? this.address = staticAddress :
    this.iotaApi.getNewAddress().subscribe(data => {
      console.log('New address [' + data.index + ']: ' + data.address);
      if (typeof data.address === "string") {
        this.address = data.address;
        this.processQRCode();
      }
    })
    */
  }

  async getAddressData() {
    if (this.address) {
      this.iotaApi.getAddressInfo(this.address).subscribe(addressData => {
        if (!isEmpty(addressData.transactions)) {
          // check amount-value on all transactions on an address
          const receivedAmount = addressData.transactions.reduce((a, b) => a + b.value, 0);
          if (receivedAmount >= this.amount) {
            this.router.navigate(['/standby'])
          }
        }
      })
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
      colorDark : "#00357a",
      colorLight : "#fecb0a",
     }, function (err, url) {
      self.qrImage = url;
    })
  }
}

async function process() {
/*
  await Amplify.Auth.signIn("<user>", "<password>")
    .then(user => {
      console.log("Authenticated")
      console.log(user);
    })
    .catch(err => {
      alert("Not authenticated");
      console.log(err);
    });
  Amplify.Auth.currentCredentials().then((info) => {
    const cognitoIdentityId = info._identityId;
    console.log(cognitoIdentityId);
  });
*/

Amplify.PubSub.subscribe('/iota-poc').subscribe({
  next: data => console.log('Message received', data),
  error: error => console.error(error),
  close: () => console.log('Done'),
});

  Amplify.PubSub.publish('/iota-poc', 'Test');
}