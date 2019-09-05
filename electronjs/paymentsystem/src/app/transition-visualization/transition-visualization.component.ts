import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '../store/store.reducer';
import { selectTransactionState } from '../store/store.selectors';

@Component({
  selector: 'app-transition-visualization',
  templateUrl: './transition-visualization.component.html',
  styleUrls: ['./transition-visualization.component.scss'],
})
export class TransitionVisualizationComponent implements OnInit {

  transactionState: string;
  transactionState$: Observable<string>;

  constructor(private store: Store<State>) {
    this.transactionState$ = store.pipe(selectTransactionState);
    this.transactionState$.subscribe(transactionStateFromStore => {
      console.log('transactionState: ', transactionStateFromStore);
      this.transactionState = transactionStateFromStore;
    });
  }

  ngOnInit() {}
}
