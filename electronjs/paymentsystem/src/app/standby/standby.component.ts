import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { get } from 'lodash';
import { environment } from '../../environments/environment';
import { filter } from 'rxjs/operators';

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

  constructor(public router: Router) {
    console.log('constructor! ');
  }

  slideOptions = {
    initialSlide: 0,
    speed: 1000,
    watchSlidesProgress: false,
    loop: true,
  };

  slidesDidLoad(slides: IonSlides) {
    console.log('slidesload ');
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(
        path => {
          console.log('eval.... ', get(path, 'url'));
          if (get(path, 'url') === '/standby') {
            this.setTimer();
          }
        }
    );

    // this.router.events.filter(event => event instanceof NavigationEnd).subscribe(path => {
    //   console.log('path = ', path);
    // });
    this.slides = slides;
    this.setTimer();
  }

  setTimer = () => {
    console.log('settimer!!! ');
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
