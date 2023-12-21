import { ref, deleteObject, fbStorage } from "../../firebase/firebase-config";
import { AppThunk } from "../../app/store";
import { selectBodyPhotosState } from "./state";
import { resetBodyPhotosState } from "./slice";
import { extractFileId } from "../../utils/extractFileId";

export const deletePhotos = (): AppThunk => async (dispatch, getState) => {
  const rootState = getState();
  const photosState = selectBodyPhotosState(rootState);
  try {
    const photosToDelete = photosState.map(extractFileId);
    const deletePromises = photosToDelete.map((photo) =>
      ref(fbStorage, `images/${photo}`)
    );
    await Promise.all(deletePromises.map((promise) => deleteObject(promise)));
    dispatch(resetBodyPhotosState());
  } catch (error) {
    dispatch(resetBodyPhotosState());
  }
};
