import { createAction, props } from '@ngrx/store';

export const setAddressToWatch = createAction('[Global] setAddressToWatch', props<{ addressToWatch: string }>());
export const setAddressM2MToWatch = createAction('[Global] setAddressM2MToWatch', props<{ addressM2MToWatch: string }>());
export const setTransactionState = createAction('[Global] setTransactionState', props<{ transactionState: string }>());
export const setM2mTransactionState = createAction('[Global] setM2MTransactionState', props<{ m2mTransactionState: string, m2mTransactionValue: number }>());
export const setRunUnderElectron = createAction('[Global] setRunUnderElectron', props<{ runUnderElectron: boolean }>());
