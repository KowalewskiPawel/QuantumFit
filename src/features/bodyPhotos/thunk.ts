import { ref, deleteObject, fbStorage } from "../../firebase/firebase-config";
import { AppThunk } from "../../app/store";
import { selectBodyPhotosState } from "./state";
import { resetBodyPhotosState } from "./slice";

const extractImageId = (link: string) => {
  // Extract the path part of the URL after 'images%2F'
  const pathStartIndex = link.indexOf("images%2F") + "images%2F".length;
  const pathEndIndex = link.indexOf("?");

  if (pathStartIndex !== -1 && pathEndIndex !== -1) {
    const encodedPath = link.substring(pathStartIndex, pathEndIndex);
    // Decode the '%2F' to '/'
    const decodedPath = decodeURIComponent(encodedPath);

    return decodedPath;
  } else {
    return null; // Return null if the link format is not as expected
  }
};

export const deletePhotos = (): AppThunk => async (dispatch, getState) => {
  const rootState = getState();
  const photosState = selectBodyPhotosState(rootState);
  try {
    const photosToDelete = photosState.map(extractImageId);
    const deletePromises = photosToDelete.map((photo) =>
      ref(fbStorage, `images/${photo}`)
    );
    await Promise.all(deletePromises.map((promise) => deleteObject(promise)));
    dispatch(resetBodyPhotosState());
  } catch (error) {
    dispatch(resetBodyPhotosState());
  }
};
