import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IotaApiService } from './iotaApi.service';
import { HeaderComponent } from './header/header.component';
import { NgxElectronModule } from 'ngx-electron';

import { StoreModule } from '@ngrx/store';
import { storeReducer } from './store/store.reducer';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { FooterModule } from './footer/footer.module';

@NgModule({
    declarations: [AppComponent, HeaderComponent],
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
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
}
