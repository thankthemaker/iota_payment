import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { FooterComponent } from './footer.component';
import { TransitionVisualizationModule } from '../transition-visualization/transition-visualization.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TransitionVisualizationModule
  ],
  exports: [
    FooterComponent,
  ],
  declarations: [FooterComponent],
})
export class FooterModule {}
