import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import anime from 'animejs'
import { State } from '../store/store.reducer';
import { selectTransactionState } from '../store/store.selectors';
import { setTransactionState } from '../store/store.actions';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';
import {
  H2M_INITIAL,
  H2M_PAYMENT_ATTACHED,
  H2M_PAYMENT_CONFIRMED,
  H2M_PAYMENT_REQUESTED,
} from '../store/transactionStatus.constants';

@Component({
  selector: 'app-transition-visualization',
  templateUrl: './transition-visualization.component.html',
  styleUrls: ['./transition-visualization.component.scss'],
  animations: [
    trigger('changeColorCoffeeMachine', [
      state(H2M_INITIAL, style({
        stroke: 'grey',
      })),
      state(H2M_PAYMENT_REQUESTED, style({
        stroke: 'orange',
      })),

      state('*', style({
        stroke: 'green',
      })),
      transition('*=>' + H2M_PAYMENT_REQUESTED, animate('2000ms')),
      transition('*=>' + H2M_PAYMENT_ATTACHED, animate('2000ms')),
      transition('*=>*', animate('2000ms'))
    ]),
    trigger('changeColorHuman', [
      state(H2M_INITIAL, style({
        fill: 'grey',
      })),
      state('*', style({
        fill: 'green',
      })),
      transition(H2M_INITIAL + '=>' + H2M_PAYMENT_REQUESTED, animate('2000ms')),
    ]),
    trigger('transitionH2M_requested', [
      state('h2m_request_start', style({
        fill: 'green',
        'padding-left': '0px',
      })),
      state('h2m_request_end', style({
        fill: 'orange',
        'padding-left': '120px',
      })),
      transition('h2m_request_start=>h2m_request_end', animate('2500ms')),
    ]),
    trigger('transitionH2M_attached', [
      state('h2m_attached_start', style({
        fill: '#6f4e37',
        'padding-left': '120px',
      })),
      state('h2m_attached_end', style({
        fill: '#6f4e37',
        'padding-left': '0px',
      })),
      transition('h2m_attached_start=>h2m_attached_end', animate('2500ms')),
    ]),
  ]
})
export class TransitionVisualizationComponent implements OnInit {

  h2mstate: string;

  transactionState: string;
  transactionState$: Observable<string>;

  h2minitial = H2M_INITIAL;
  h2mpaymentrequested = H2M_PAYMENT_REQUESTED;
  h2mpaymentattached = H2M_PAYMENT_ATTACHED;
  h2mpaymentconfirmed = H2M_PAYMENT_CONFIRMED;

  doAnimation() {
    if (this.transactionState === H2M_PAYMENT_REQUESTED) {
      anime({
        targets: ['.h2m-transition-icon'],
        translateX: '150',
        duration: 4000,
        loop: true,
        easing: 'easeInOutQuad'
      });
    }
  }

  constructor(private store: Store<State>) {
    this.transactionState$ = this.store.pipe(selectTransactionState);
    this.transactionState$.subscribe(transactionStateFromStore => {
      console.log('transactionState: ', transactionStateFromStore);
      this.transactionState = transactionStateFromStore;
      this.h2mstate = 'human';
      setTimeout(() => {
        if (this.transactionState === H2M_PAYMENT_REQUESTED) {
          this.h2mstate = 'h2m_request_start';
        }
        if (this.transactionState === H2M_PAYMENT_ATTACHED) {
          this.h2mstate = 'h2m_attached_start';
        }
      }, 0);
    });
  }

  // ionViewDidLoad() {
  ngAfterViewInit() {
    // anime({
    //   targets: ['.h2m-transition-icon'],
    //   translateX: '150',
    //   duration: 4000,
    //   loop: true,
    //   easing: 'easeInOutQuad'
    // });

  }

  ngOnInit() {}

  changeState(transactionState) {
    this.store.dispatch(setTransactionState({ transactionState }));
  }

  onEndH2mReqeust(event) {
    this.h2mstate = 'h2m_request_start';
    if (this.transactionState === H2M_PAYMENT_REQUESTED && event.toState === 'h2m_request_start') {
      setTimeout(() => {
        this.h2mstate = 'h2m_request_end';
      }, 0);
    }
  }

  onEndH2mAttached(event) {
    this.h2mstate = 'h2m_attached_start';
    if (this.transactionState === H2M_PAYMENT_ATTACHED && event.toState === 'h2m_attached_start') {
      setTimeout(() => {
        this.h2mstate = 'h2m_attached_end';
      }, 0);
    }

  }
}
