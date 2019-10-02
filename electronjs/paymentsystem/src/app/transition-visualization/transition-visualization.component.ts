import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import anime from 'animejs'
import { State } from '../store/store.reducer';
import { selectM2mTransactionState, selectTransactionState } from '../store/store.selectors';
import { setM2mTransactionState, setTransactionState } from '../store/store.actions';
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
import {
  M2M_INITIAL,
  M2M_PAYMENT_ATTACHED,
  M2M_PAYMENT_CONFIRMED,
  M2M_PAYMENT_REQUESTED,
} from '../store/transactionM2MStatus.constants';

@Component({
  selector: 'app-transition-visualization',
  templateUrl: './transition-visualization.component.html',
  styleUrls: ['./transition-visualization.component.scss'],
  animations: [
    trigger('human', [
      state(H2M_INITIAL, style({
        fill: 'grey',
      })),
      state('*', style({
        fill: 'green',
      })),
      transition('*=>*', animate('2000ms')),
    ]),
    trigger('human-coffeemachine', [
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
    trigger('coffeemachine-human', [
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
    trigger('coffeemachine', [
      state(H2M_INITIAL, style({
        stroke: 'grey',
      })),
      state(H2M_PAYMENT_REQUESTED, style({
        stroke: '#FFC300',
      })),

      state(H2M_PAYMENT_ATTACHED, style({
        stroke: '#808000',
      })),

      state('*', style({
        stroke: '#008000',
      })),
      transition('*=>*', animate('2000ms'))
    ]),
    trigger('coffeemachine-energy', [
      state('m2m_request_start', style({
        fill: 'green',
        'padding-left': '0px',
      })),
      state('m2m_request_end', style({
        fill: 'orange',
        'padding-left': '120px',
      })),
      transition('m2m_request_start=>m2m_request_end', animate('2500ms')),
    ]),
    trigger('energy', [
      state(M2M_INITIAL, style({
        fill: 'grey',
      })),
      state(M2M_PAYMENT_REQUESTED, style({
        fill: '#FFC300',
      })),

      state('*', style({
        fill: '#008000',
      })),
      // transition('*=>' + M2M_PAYMENT_REQUESTED, animate('2000ms')),
      transition('*=>*', animate('2000ms'))
    ]),
  ]
})
export class TransitionVisualizationComponent implements OnInit {

  h2mstate: string;
  m2mstate: string;

  transactionState: string;
  transactionState$: Observable<string>;

  m2mTransactionState: string;
  m2mTransactionState$: Observable<string>;

  h2minitial = H2M_INITIAL;
  h2mpaymentrequested = H2M_PAYMENT_REQUESTED;
  h2mpaymentattached = H2M_PAYMENT_ATTACHED;
  h2mpaymentconfirmed = H2M_PAYMENT_CONFIRMED;

  m2minitial = M2M_INITIAL;
  m2mrequested = M2M_PAYMENT_REQUESTED;
  m2mconfirmed = M2M_PAYMENT_CONFIRMED;

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
      this.transactionState = transactionStateFromStore;
      if (this.transactionState === H2M_PAYMENT_CONFIRMED) {
        setTimeout(() => {
          this.store.dispatch(setTransactionState({ transactionState: H2M_INITIAL }));
        }, 8000);
      }
      setTimeout(() => {
        if (this.transactionState === H2M_PAYMENT_REQUESTED) {
          this.h2mstate = 'h2m_request_start';
        }
        if (this.transactionState === H2M_PAYMENT_ATTACHED) {
          this.h2mstate = 'h2m_attached_start';
        }
      }, 0);
    });
    this.m2mTransactionState$ = this.store.pipe(selectM2mTransactionState);
    this.m2mTransactionState$.subscribe(m2mTransactionStateFromStore => {
      this.m2mTransactionState = m2mTransactionStateFromStore;
      if (this.m2mTransactionState === M2M_PAYMENT_CONFIRMED) {
        setTimeout(() => {
          this.store.dispatch(setM2mTransactionState({ m2mTransactionState: M2M_INITIAL, m2mTransactionValue: 0}));
        }, 8000);
      }

      setTimeout(() => {
        if (this.m2mTransactionState === M2M_PAYMENT_REQUESTED) {
          this.m2mstate = 'm2m_request_start';
        }
        if (this.m2mTransactionState === M2M_PAYMENT_ATTACHED) {
          this.m2mstate = 'm2m_attached_start';
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

  // To loop transitions
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

  onEndM2mReqeust(event) {
    this.m2mstate = 'm2m_request_start';
    if (this.m2mTransactionState === M2M_PAYMENT_REQUESTED && event.toState === 'm2m_request_start') {
      setTimeout(() => {
        this.m2mstate = 'm2m_request_end';
      }, 0);
    }
  }

  changeState(transactionState) {
    if (transactionState.startsWith('m2m')) {
      this.store.dispatch(setM2mTransactionState({ m2mTransactionState: transactionState, m2mTransactionValue: 10}));
    } else {
      this.store.dispatch(setTransactionState({transactionState}));
    }
  }
}
