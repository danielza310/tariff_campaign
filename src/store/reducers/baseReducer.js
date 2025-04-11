import {
  UPDATE_BASE_STORE,
} from '../types';

const initialState = {
  users: [],
  unreadmessages:[],
  loading:false,
  unreadmessages_update:0,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case UPDATE_BASE_STORE:
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
}
