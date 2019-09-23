import { Component, OnInit } from '@angular/core';
import Amplify, { Analytics } from 'aws-amplify';
//import { Router } from '@angular/router';

@Component({
  selector: 'app-dummy',
  templateUrl: './dummy.component.html',
  styleUrls: ['./dummy.component.scss'],
})
export class DummyComponent implements OnInit {

  constructor(/*private router: Router*/) {}

  ngOnInit() {}

  getCoffee() {
    console.log('getCoffee ');
    Amplify.PubSub.publish('/iota-poc',
    {
      'command': 'payment',
      'product': 'Espresso',
      'price': 1
    });
  }
}
