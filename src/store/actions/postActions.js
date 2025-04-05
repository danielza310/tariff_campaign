import {
  UPDATE_POST_STORE,
} from '../types';

export const updatePost = (data) => (dispatch) => {
  dispatch({ type: 
    UPDATE_POST_STORE, payload:data });
};

