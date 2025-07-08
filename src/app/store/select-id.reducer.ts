// filepath: e:\MyData\Work\Angular\VirtualGlassesTry-On\src\app\store\select-id.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { setSelectId, clearSelectId } from './select-id.actions';
import { SelectIdState, initialState } from './select-id.state';

export const selectIdReducer = createReducer(
  initialState,
  on(setSelectId, (state, { select_id }) => ({ ...state, select_id })),
  on(clearSelectId, (state) => ({ ...state, select_id: null }))
);