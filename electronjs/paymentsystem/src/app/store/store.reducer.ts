import { Action, createReducer, on } from '@ngrx/store';
import {
    setAddressToWatch,
    setAddressM2MToWatch,
    setM2mTransactionState,
    setRunUnderElectron,
    setTransactionState,
} from './store.actions';
import { H2M_INITIAL } from './transactionStatus.constants';
import { M2M_INITIAL } from './transactionM2MStatus.constants';

export interface State {
    addressToWatch: string;
    addressM2MToWatch: string;
    transactionState: string;
    m2mTransactionState: string;
    m2mTransactionValue: number;
    runUnderElectron: boolean;
}

export const initialState: State = {
    addressToWatch: '',
    addressM2MToWatch: '',
    transactionState: H2M_INITIAL,
    m2mTransactionState: M2M_INITIAL,
    m2mTransactionValue: 0,
    runUnderElectron: false,
};

const _storeReducer = createReducer(initialState,
    on(setAddressToWatch, (state, { addressToWatch }) => ({ ...state, addressToWatch })),
    on(setAddressM2MToWatch, (state, { addressM2MToWatch }) => ({ ...state, addressM2MToWatch })),
    on(setTransactionState, (state, { transactionState }) => ({ ...state, transactionState })),
    on(setM2mTransactionState, (state, { m2mTransactionState, m2mTransactionValue }) => ({ ...state, m2mTransactionState, m2mTransactionValue })),
    on(setRunUnderElectron, (state, { runUnderElectron }) => ({ ...state, runUnderElectron })),
);

export function storeReducer(state: State | undefined, action: Action) {
    return _storeReducer(state, action);
}
