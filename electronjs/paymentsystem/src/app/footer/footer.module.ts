import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { FooterComponent } from './footer.component';
import { TransitionVisualizationComponent } from '../transition-visualization/transition-visualization.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  exports: [
    FooterComponent,
  ],
  declarations: [FooterComponent, TransitionVisualizationComponent],
})
export class FooterModule {}
