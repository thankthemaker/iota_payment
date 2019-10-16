import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { environment } from '../../environments/environment';

const slideChangeIntervalInSeconds = 10;

@Component({
  selector: 'app-standby',
  templateUrl: './standby.component.html',
  styleUrls: ['./standby.component.scss'],
})
export class StandbyComponent implements OnInit {
  slides: any;
  slidesTimer: any;
  isProduction = environment.production;

  constructor(public router: Router) {}

  slideOptions = {
    initialSlide: 0,
    speed: 1000,
    watchSlidesProgress: false,
    loop: true,
  };

  slidesDidLoad(slides: IonSlides) {
    this.slides = slides;

    this.slidesTimer = setInterval(() => {
      if (this.router.isActive('/standby', false)) {
        this.slides.slideNext();
      } else {
        clearInterval(this.slidesTimer);
      }
      }, slideChangeIntervalInSeconds * 1000);
  }

  ngOnInit() {
  }
}
