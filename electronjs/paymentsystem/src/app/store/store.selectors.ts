import { select } from '@ngrx/store';

export const selectAddressToWatch = select('global', 'addressToWatch');
export const selectAddressM2MToWatch = select('global', 'addressM2MToWatch');
export const selectTransactionState = select('global', 'transactionState');
export const selectM2mTransactionState = select('global', 'm2mTransactionState');
export const selectRunUnderElectron = select('global', 'runUnderElectron');
export const selectCoffeemachineState = select('global', 'coffeemachineState');
