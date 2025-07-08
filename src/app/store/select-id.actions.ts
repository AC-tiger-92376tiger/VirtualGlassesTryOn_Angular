// filepath: e:\MyData\Work\Angular\VirtualGlassesTry-On\src\app\store\select-id.actions.ts
import { createAction, props } from '@ngrx/store';

export const setSelectId = createAction(
  '[Glass Item] Set Select ID',
  props<{ select_id: string }>()
);

export const clearSelectId = createAction('[Glass Item] Clear Select ID');