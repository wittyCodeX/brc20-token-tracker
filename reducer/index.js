import { combineReducers } from 'redux';
import walletReducer from './walletReducer';
import unisatReducer from './unisatReducer';
import rankingReducer from './rankingReducer';

const rootReducer = combineReducers({
  wallet: walletReducer,
  unisat: unisatReducer,
  ranking: rankingReducer,
});

export default rootReducer;