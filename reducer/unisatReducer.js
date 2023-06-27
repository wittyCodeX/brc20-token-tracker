const initialState = {
    total: 0,
    start: 0,
    currentPage: 1,
    detail: [],
    loading: false,
    query: '',
    matchQueryValueCount: 0,
    presentHasValueCount: 0,
};

const unisatReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_UNISAT_DATA':
            return {
                ...state,
                total: action.payload.total,
                start: action.payload.start,
                detail: action.payload.detail,
            };
        case 'SET_CURRENT_PAGE':
            return {
                ...state,
                currentPage: action.payload
            }
        case 'SET_LOADING':
            return {
                ...state,
                loading: action.payload
            }
        case 'SET_QUERY':
            return {
                ...state,
                query: action.payload
            }
        case 'SET_HASVALUE_TOKEN_COUNT':
            console.log('------asdfasf-----', action.payload)
            return {
                ...state,
                matchQueryValueCount: action.payload,
            }
        case 'SET_CURRENT_VALUETOKEN_COUNT':
            console.log('------sdfsdfsd-----', action.payload)
            return {
                ...state,
                presentHasValueCount: action.payload
            }
        default:
            return state;
    }
};

export default unisatReducer;