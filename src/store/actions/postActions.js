import {
  UPDATE_POST_STORE,
} from '../types';

import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase"


export const updatePost = (data) => (dispatch) => {
  dispatch({ type: 
    UPDATE_POST_STORE, payload:data });
};

export const updateRecommendation = (data) => (dispatch) => {
  try {
    const post = doc(db, "posts", data.id);

    updateDoc(post, { ...data, updatedAt: new Date() 
    }).then((res) => {
      dispatch({ type: UPDATE_POST_STORE, payload: postRef });
    })

    console.log("Post updated successfully!");
  } catch (error) {
    console.error("Error updating post:", error.message);
  }
};
