
import { createStore } from 'redux';
import rootReducer from 'reducer/index';

let initialized = false;

function myInitFunction(store) {
    if (!initialized) {
        initialized = true;
    }
}

const store = createStore(rootReducer);

store.subscribe(() => myInitFunction(store));

export default store;