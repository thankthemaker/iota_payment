import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'standby', pathMatch: 'full' },
  { path: 'standby', loadChildren: './standby/standby.module#StandbyModule' },
  { path: 'payment', loadChildren: './payment/payment.module#PaymentModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
