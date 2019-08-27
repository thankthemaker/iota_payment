import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import { AWS } from '@aws-amplify/core';
import Amplify, { Analytics } from 'aws-amplify';
import * as awsamplify from './aws-exports';

AWS.config.update({
  credentials: new AWS.Credentials ({
    accessKeyId: environment.accessKeyId,
    secretAccessKey: environment.secretAccessKey
  })
})

Amplify.configure(awsamplify.pubsub);

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

