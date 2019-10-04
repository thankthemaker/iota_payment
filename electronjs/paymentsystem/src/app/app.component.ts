import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { get } from 'lodash';

import { AWSIoTProvider } from '@aws-amplify/pubsub/lib/Providers';
import { AWS } from '@aws-amplify/core';
import Amplify, { Analytics } from 'aws-amplify';
import { ElectronService } from 'ngx-electron';
import { Store } from '@ngrx/store';
import { State } from './store/store.reducer';
import { setRunUnderElectron, setTransactionState } from './store/store.actions';
import { H2M_INITIAL, H2M_PAYMENT_ATTACHED, H2M_PAYMENT_REQUESTED } from './store/transactionStatus.constants';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private electronService: ElectronService,
    private store: Store<State>,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

    this.store.dispatch(setRunUnderElectron({ runUnderElectron: !!get(this, 'electronService.process') }));

    AWS.config.update({
      credentials: new AWS.Credentials (
        {
          accessKeyId: get(this, 'electronService.process.env.AWS_ACCESS_KEY_ID', null),
          secretAccessKey: get(this, 'electronService.process.env.AWS_SECRET_ACCESS_KEY', null),
        }
      )
    });

    Amplify.addPluggable(new AWSIoTProvider(
      {
        aws_pubsub_region: 'eu-central-1',
        aws_pubsub_endpoint: 'wss://a3dtjrh1oco8co-ats.iot.eu-central-1.amazonaws.com/mqtt',
      }
    ));

    Amplify.PubSub.subscribe('/iota-poc').subscribe({
      next: data => {
        console.log('Message received', data);
        switch (data.value.command) {
          case "payment":
            this.router.navigate(['/payment/' + data.value.productcode + "/" + data.value.product + "/" + data.value.price]);
            this.store.dispatch(setTransactionState({ transactionState: H2M_PAYMENT_REQUESTED }));
            break;
          case "standby":
              this.router.navigate(['/standby']);
              this.store.dispatch(setTransactionState({ transactionState: H2M_INITIAL }));
            break;
          case "processing":
                this.router.navigate(['/processing']);
              break;
          case "coffee":
            Amplify.PubSub.publish('/iota-poc', data.value.product);
            break;
          case "brewing":
              this.router.navigate(['/brewing']);
              this.store.dispatch(setTransactionState({ transactionState: H2M_PAYMENT_ATTACHED }));
              break;
          default:
            console.log("Unknown command " + data.value);
        }
      },
      error: error => console.error(error),
      close: () => console.log('Done'),
    });
  }
}
