import { createAction, props } from '@ngrx/store';

export const setAddressToWatch = createAction('[Global] setAddressToWatch', props<{ addressToWatch: string }>());
export const setTransactionState = createAction('[Global] setTransactionState', props<{ transactionState: string }>());
