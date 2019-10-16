import { ErrorHandler, Injectable, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { AppRoutingModule } from './app-routing.module';
import { IotaApiService } from './iotaApi.service';
import { HeaderComponent } from './header/header.component';
import { NgxElectronModule } from 'ngx-electron';
import * as Sentry from "@sentry/browser";

import { StoreModule } from '@ngrx/store';
import { get } from 'lodash';
import { storeReducer } from './store/store.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { FooterModule } from './footer/footer.module';

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
    constructor() {
        Sentry.init({
            dsn: "https://f30421445073428abd2b8cd9948b2487@sentry.io/1780576",
            environment: environment.name,
            integrations(integrations) {
                // this is to prevent double error-messages in sentry (default integration + custom handler)
                // see https://github.com/getsentry/sentry-javascript/issues/2169
                return integrations.filter(i => i.name !== "TryCatch");
            }
        });
    }
    handleError(error) {
        if (get(error, 'name') === 'HttpErrorResponse') {
            Sentry.setExtra('Api-Error', error);
            Sentry.setTag('Type', 'Api-Error');
            Sentry.captureException(new Error(error.message));
        } else {
            Sentry.captureException(error.originalError || error);
        }
    }
}

export function getErrorHandler(): ErrorHandler {
    if (environment.sentryEnabled) {
        return new SentryErrorHandler()
    }
    return new ErrorHandler()
}

@NgModule({
    declarations: [AppComponent, HeaderComponent, TransactionsComponent],
    entryComponents: [],
    imports: [
        BrowserModule,
        StoreModule.forRoot({global: storeReducer}),
        HttpClientModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        NgxElectronModule,
        StoreDevtoolsModule.instrument({maxAge: 25, logOnly: environment.production}),
        FooterModule,
    ],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        IotaApiService,
        {provide: ErrorHandler, useFactory: getErrorHandler},
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
}
