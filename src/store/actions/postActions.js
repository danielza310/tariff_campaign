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
  return new Promise((res, rej) => {
    if(data.id==undefined){
      rej();
      return
    } 
    try {
      const post = doc(db, "posts", data.id);
      updateDoc(post, { ...data, updatedAt: new Date() 
      }).then((res1) => {
        dispatch({ type: UPDATE_POST_STORE, payload: data });
        res();
      })
    } catch (error) {
      console.error("Error updating post:", error.message);
      rej();
    }
  });
};
