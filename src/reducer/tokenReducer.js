const initialState = {
  tokenPriceData: {},
  tokenList: [],
  tokenPerPage: 10,
  currentPage: 0,
  offsetFromStart: 0,
  offsetFromEnd: 0
};

const tokenReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_TOKEN_PRICE_DATA":
      return {
        ...state,
        tokenPriceData: action.payload
      };
    case "ADD_TOKEN_LIST":
      let newTokenList = [];
      console.log(state.tokenList);
      if (state.tokenList.length === 0) {
        newTokenList = [...action.payload].sort(
          (a, b) => b.inscriptionNumberStart > a.inscriptionNumberStart
        );
      } else {
        newTokenList = [...state.tokenList, ...action.payload].sort(
          (a, b) => b.inscriptionNumberStart > a.inscriptionNumberStart
        );
      }
      return {
        ...state,
        tokenList: newTokenList
      };
    case "SET_TOKEN_PER_PAGE":
      return {
        ...state,
        tokenPerPage: action.payload
      };
    case "SET_CURRENT_PAGE":
      return {
        ...state,
        currentPage: action.payload
      };
    case "SET_OFFSET_FROM_START":
      return {
        ...state,
        offsetFromStart: action.payload
      };
    case "SET_OFFSET_FROM_END":
      return {
        ...state,
        offsetFromEnd: action.payload
      };
    default:
      return state;
  }
};

export default tokenReducer;
