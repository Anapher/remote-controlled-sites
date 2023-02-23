import { RootState } from '../../app/store';

export const selectHadUserInteraction = (state: RootState) => state.userInteraction.hadInteraction;
