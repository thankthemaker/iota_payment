import { Action, createReducer, on } from '@ngrx/store';
import { setAddressToWatch } from './store.actions';

export interface State {
    addressToWatch: string;
}

export const initialState: State = {
    addressToWatch: '',
};

const _storeReducer = createReducer(initialState,
    on(setAddressToWatch, (state, { addressToWatch }) => ({ ...state, addressToWatch })),
);

export function storeReducer(state: State | undefined, action: Action) {
    return _storeReducer(state, action);
}
