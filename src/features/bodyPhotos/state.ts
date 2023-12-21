import type { RootState } from "../../app/store";

export type BodyPhotosState = any[];

export const selectBodyPhotosState = (state: RootState) => state.bodyPhotos;
