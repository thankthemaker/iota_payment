import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

import { AWSIoTProvider } from '@aws-amplify/pubsub/lib/Providers';
import { AWS } from '@aws-amplify/core';
import Amplify, { Analytics } from 'aws-amplify';
import * as awsamplify from '../aws-exports';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });


AWS.config.update({
  credentials: new AWS.Credentials ({
    accessKeyId: environment.accessKeyId,
    secretAccessKey: environment.secretAccessKey
  })
})

Amplify.addPluggable(new AWSIoTProvider({
  aws_pubsub_region: 'eu-central-1',
  aws_pubsub_endpoint: 'wss://a3dtjrh1oco8co-ats.iot.eu-central-1.amazonaws.com/mqtt',
}));

Amplify.PubSub.subscribe('/iota-poc').subscribe({
  next: data => {
    console.log('Message received', data)
    this.router.navigate(['/payment'])
  },
  error: error => console.error(error),
  close: () => console.log('Done'),
});
  }
}
