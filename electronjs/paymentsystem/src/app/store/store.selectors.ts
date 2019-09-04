import { select } from '@ngrx/store';

export const selectAddressToWatch = select('global', 'addressToWatch');
export const selectTransactionState = select('global', 'transactionState');
