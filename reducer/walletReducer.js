const initialState = {
    isConnected: false,
    address: null,
    balance: 0
};

const walletReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'CONNECT':
            return {
                ...state,
                isConnected: true,
            };
        case 'ADDRESS':
            return {
                ...state,
                isConnected: true,
                address: action.payload,
            };
        case 'BALANCE':
            return {
                ...state,
                balance: action.payload
            };
        case 'DISCONNECT':
            return {
                ...state,
                isConnected: false,
                address: null,
                balance: 0,
            };
        default:
            return state;
    }
};

export default walletReducer;