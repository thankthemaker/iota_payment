import { Component, OnInit } from '@angular/core';
import Amplify, { Analytics } from 'aws-amplify';

@Component({
  selector: 'app-standby',
  templateUrl: './standby.component.html',
  styleUrls: ['./standby.component.scss'],
})
export class StandbyComponent implements OnInit {

  constructor(){}

  ngOnInit() {}

  getCoffee() {
    console.log('getCoffee ');
    Amplify.PubSub.publish('/iota-poc', 'coffee');
  }
}
