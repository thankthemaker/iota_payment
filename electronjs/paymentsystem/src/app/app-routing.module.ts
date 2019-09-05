import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'standby', pathMatch: 'full' },
  { path: 'standby', loadChildren: './standby/standby.module#StandbyModule' },
  { path: 'payment/:product/:price', loadChildren: './payment/payment.module#PaymentModule' },
  { path: 'brewing', loadChildren: './brewing/brewing.module#BrewingModule' },
  { path: 'processing', loadChildren: './processing/processing.module#ProcessingModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
