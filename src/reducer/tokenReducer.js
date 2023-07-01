const initialState = {
  tokenPriceData: {},
  tokenList: [],
  tokenPerPage: 10,
  currentPage: 0,
  offsetFromStart: 0,
};

const tokenReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_TOKEN_PRICE_DATA":
      return {
        ...state,
        tokenPriceData: action.payload,
      };
    case "ADD_TOKEN_LIST":
      return {
        ...state,
        tokenList: action.payload,
      };
    case "SET_TOKEN_PER_PAGE":
      return {
        ...state,
        tokenPerPage: action.payload,
      };
    case "SET_CURRENT_PAGE":
      return {
        ...state,
        currentPage: action.payload,
      };
    case "SET_OFFSET_FROM_START":
      return {
        ...state,
        offsetFromStart: action.payload,
      };
    default:
      return state;
  }
};

export default tokenReducer;
