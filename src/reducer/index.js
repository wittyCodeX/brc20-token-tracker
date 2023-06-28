import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import statsReducer from "./statsReducer";
import tokenReducer from "./tokenReducer";
const rootReducer = combineReducers({
  stats: statsReducer,
  tokenData: tokenReducer
});

const persistConfig = {
  key: "root",
  storage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;
