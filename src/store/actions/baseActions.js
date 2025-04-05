import {
  UPDATE_BASE_STORE,
} from '../types';

export const updateBase = (data) => (dispatch) => {
  dispatch({ type: 
    UPDATE_BASE_STORE, payload:data });
};

