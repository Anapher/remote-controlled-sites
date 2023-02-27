import { createSlice, PayloadAction, ThunkAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { getServerTime } from '../../services/auth';

interface SyncTimeState {
   loading: boolean;
   offset?: number;
}

const initialState: SyncTimeState = {
   loading: false,
};

export const slice = createSlice({
   name: 'sync-time',
   initialState,
   reducers: {
      setLoading(state, { payload }: PayloadAction<boolean>) {
         state.loading = payload;
      },
      setOffset(state, { payload }: PayloadAction<number>) {
         state.offset = payload;
      },
   },
});

export const syncServerTime: () => ThunkAction<Promise<void>, RootState, any, any> = () => {
   return async (dispatch) => {
      dispatch(slice.actions.setLoading(true));
      try {
         const start = new Date().getTime();
         const time = await getServerTime();
         const end = new Date().getTime();

         const delay = end - start;
         const oneWayDelay = delay / 2;
         const offset = time - end - oneWayDelay;

         dispatch(slice.actions.setOffset(offset));
      } catch (error) {
         console.log('time sync failed', error);
      } finally {
         dispatch(slice.actions.setLoading(false));
      }
   };
};

export default slice.reducer;
