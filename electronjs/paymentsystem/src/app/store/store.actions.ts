import { createAction, props } from '@ngrx/store';

export const setAddressToWatch = createAction('[Counter Component] setAddressToWatch', props<{ addressToWatch: string }>());
