import {
  UPDATE_POST_STORE,
} from '../types';

const initialState = {
  posts: [],
  keyword:'',
  serverTime: ""
};

export default function(state = initialState, action) {
  switch (action.type) {
    case UPDATE_POST_STORE:
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
}
