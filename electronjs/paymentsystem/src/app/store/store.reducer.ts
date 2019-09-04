import { Action, createReducer, on } from '@ngrx/store';
import { setAddressToWatch, setTransactionState } from './store.actions';

export interface State {
    addressToWatch: string;
    transactionState: string;
}

export const initialState: State = {
    addressToWatch: '',
    transactionState: 'initial',
};

const _storeReducer = createReducer(initialState,
    on(setAddressToWatch, (state, { addressToWatch }) => ({ ...state, addressToWatch })),
    on(setTransactionState, (state, { transactionState }) => ({ ...state, transactionState })),
);

export function storeReducer(state: State | undefined, action: Action) {
    return _storeReducer(state, action);
}
