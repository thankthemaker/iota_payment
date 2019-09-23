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

@Component({
  selector: 'app-transition-visualization',
  templateUrl: './transition-visualization.component.html',
  styleUrls: ['./transition-visualization.component.scss'],
  animations: [
    trigger('changeColorCoffeeMachine', [
      state('initial', style({
        stroke: 'grey',
      })),
      state('payment_requested', style({
        stroke: 'orange',
      })),

      state('*', style({
        stroke: 'green',
      })),
      transition('*=>payment_requested', animate('1500ms')),
      transition('*=>payment_attached', animate('1500ms')),
      transition('*=>*', animate('1500ms'))
    ]),
    trigger('changeColorHuman', [
      state('initial', style({
        fill: 'grey',
      })),
      state('*', style({
        fill: 'green',
      })),
      transition('initial=>payment_requested', animate('1500ms')),
    ]),
    trigger('transitionH2M_requested', [
      state('h2m_request_start', style({
        fill: 'green',
        'padding-left': '0px',
      })),
      state('h2m_request_end', style({
        fill: 'orange',
        'padding-left': '170px',
      })),
      transition('h2m_request_start=>h2m_request_end', animate('2000ms')),
    ]),
    trigger('transitionH2M_attached', [
      state('h2m_attached_start', style({
        fill: '#6f4e37',
        'padding-left': '170px',
      })),
      state('h2m_attached_end', style({
        fill: '#6f4e37',
        'padding-left': '0px',
      })),
      transition('h2m_attached_start=>h2m_attached_end', animate('2000ms')),
    ]),
  ]
})
export class TransitionVisualizationComponent implements OnInit {

  h2mstate: string;

  transactionState: string;
  transactionState$: Observable<string>;

  doAnimation() {
    if (this.transactionState === 'payment_requested') {
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
        if (this.transactionState === 'payment_requested') {
          this.h2mstate = 'h2m_request_start';
        }
        if (this.transactionState === 'payment_attached') {
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
    if (this.transactionState === 'payment_requested' && event.toState === 'h2m_request_start') {
      setTimeout(() => {
        this.h2mstate = 'h2m_request_end';
      }, 0);
    }
  }

  onEndH2mAttached(event) {
    this.h2mstate = 'h2m_attached_start';
    if (this.transactionState === 'payment_attached' && event.toState === 'h2m_attached_start') {
      setTimeout(() => {
        this.h2mstate = 'h2m_attached_end';
      }, 0);
    }

  }
}
