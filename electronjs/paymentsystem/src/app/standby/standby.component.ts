import { Component, OnInit } from '@angular/core';
// import Amplify, { Analytics } from 'aws-amplify';
import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-standby',
  templateUrl: './standby.component.html',
  styleUrls: ['./standby.component.scss'],
})
export class StandbyComponent implements OnInit {

  constructor(private router: Router) {}

  slideOptions = {
    initialSlide: 1,
    speed: 1000,
    watchSlidesProgress: false,
    loop: true,
  };

  slidesDidLoad(slides: IonSlides) {
    slides.startAutoplay();
  }

  ngOnInit() {
  }

  getCoffee() {
    console.log('getCoffee ');
    // Amplify.PubSub.publish('/iota-poc',
    // {
    //   'command': 'payment',
    //   'product': 'Espresso',
    //   'price': 1
    // });
    this.router.navigate(['/payment/kaffee/1'])
  }
}
