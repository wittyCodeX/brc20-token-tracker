const initialState = {
    coins: [],
    stats: {}, 
    tokenNameArray: [],
    hasPriceObjectArray: [],
    tokenPerScreen: 20,
};

const rankingReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_RANKING_TOTAL':
            return {
                ...state,
                stats: action.payload,
            };
        case 'GET_RANKING_COIN':
            return {
                ...state,
                coins: action.payload,
                tokenNameArray: action.payload.map(token => token.name.toLowerCase()),
                hasPriceObjectArray: action.payload.filter(token => token.price != null),
            };
        default:
            return state;
    }
};

export default rankingReducer;