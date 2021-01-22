import {
    SET_CURRENT_USER,
    SET_ERRORS,
    CLEAR_ERRORS,
    LOGOUT_USER,
    SET_MY_POSTS,
    SET_ALL_POSTS,
    SET_MY_FOLLOWING,
} from "../actions/actionTypes";

const initialState = {
    isAuthenticated: false,
    user: {},
    errorMsg: null,
    allPosts: [],
    myPosts: [],
    myFollowing: [],
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_CURRENT_USER:
            {
                return {
                    ...state,
                    isAuthenticated: action.payload.id && action.payload.email && action.payload.password ?
                        true :
                        false,
                    user: action.payload,
                };
            }
        case SET_ERRORS:
            {
                return {
                    ...state,
                    errorMsg: action.payload.error,
                };
            }
        case CLEAR_ERRORS:
            {
                return {
                    ...state,
                    errorMsg: null,
                };
            }
        case LOGOUT_USER:
            {
                return {
                    ...state,
                    isAuthenticated: false,
                    user: {},
                };
            }
        case SET_MY_POSTS:
            {
                return {
                    ...state,
                    myPosts: action.payload,
                };
            }
        case SET_ALL_POSTS:
            {
                return {
                    ...state,
                    allPosts: action.payload,
                };
            }
        case SET_MY_FOLLOWING:
            {
                return {
                    ...state,
                    myFollowing: action.payload,
                };
            }
        default:
            return state;
    }
};

export default reducer;