const initialState = {
  totalTokens: 0,
  marketCap: 0,
  volume: 0
};

const statsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_MARKET_STATS":
      return {
        ...action.payload
      };
    default:
      return state;
  }
};

export default statsReducer;
