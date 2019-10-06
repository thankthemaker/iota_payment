import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { setCoffeemachineState } from '../store/store.actions';
import { COFFEEMACHINE_BREWING, COFFEEMACHINE_STANDBY } from '../store/coffeemachineState.constants';
import { Store } from '@ngrx/store';
import { State } from '../store/store.reducer';

@Component({
  selector: 'app-brewing',
  templateUrl: './brewing.component.html',
  styleUrls: ['./brewing.component.scss'],
})
export class BrewingComponent implements OnInit {
  constructor(private router: Router, private store: Store<State>) { }

  redirectTimer() {
    setTimeout(() => {
      this.store.dispatch(setCoffeemachineState({ coffeemachineState: COFFEEMACHINE_STANDBY }));
      this.router.navigate(['standby']);
    }, 11000);
  }

  ngOnInit() {
    this.store.dispatch(setCoffeemachineState({ coffeemachineState: COFFEEMACHINE_BREWING }));
    this.redirectTimer();
  }
}
