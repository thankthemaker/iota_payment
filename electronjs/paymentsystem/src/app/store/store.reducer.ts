import { Action, createReducer, on } from '@ngrx/store';
import {
    setAddressToWatch,
    setPrice,
    setAddressM2MToWatch,
    setM2mTransactionState,
    setRunUnderElectron,
    setTransactionState,
    setCoffeemachineState,
} from './store.actions';
import { H2M_INITIAL } from './transactionStatus.constants';
import { M2M_INITIAL } from './transactionM2MStatus.constants';
import { COFFEEMACHINE_STANDBY } from './coffeemachineState.constants';

export interface State {
    addressToWatch: string;
    price: number;
    addressM2MToWatch: string;
    transactionState: string;
    m2mTransactionState: string;
    m2mTransactionValue: number;
    runUnderElectron: boolean;
    coffeemachineState: string;
}

export const initialState: State = {
    addressToWatch: '',
    price: 0,
    addressM2MToWatch: '',
    transactionState: H2M_INITIAL,
    m2mTransactionState: M2M_INITIAL,
    m2mTransactionValue: 0,
    runUnderElectron: false,
    coffeemachineState: COFFEEMACHINE_STANDBY,
};

const _storeReducer = createReducer(initialState,
    on(setAddressToWatch, (state, { addressToWatch }) => ({ ...state, addressToWatch })),
    on(setPrice, (state, { price }) => ({ ...state, price })),
    on(setAddressM2MToWatch, (state, { addressM2MToWatch }) => ({ ...state, addressM2MToWatch })),
    on(setTransactionState, (state, { transactionState }) => ({ ...state, transactionState })),
    on(setM2mTransactionState, (state, { m2mTransactionState, m2mTransactionValue }) => ({ ...state, m2mTransactionState, m2mTransactionValue })),
    on(setRunUnderElectron, (state, { runUnderElectron }) => ({ ...state, runUnderElectron })),
    on(setCoffeemachineState, (state, { coffeemachineState }) => ({ ...state, coffeemachineState })),
);

export function storeReducer(state: State | undefined, action: Action) {
    return _storeReducer(state, action);
}
