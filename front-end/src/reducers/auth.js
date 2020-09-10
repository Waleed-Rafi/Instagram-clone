import {
    SET_CURRENT_USER,
    SET_ERRORS,
    CLEAR_ERRORS,
    LOGOUT_USER,
    SET_MY_POSTS
} from '../actions/actionTypes'

const initialState = {
    isAuthenticated: false,
    user: {},
    errorMsg: null,
    allPosts: [],
    myPosts: []
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_CURRENT_USER: {
            return {
                ...state,
                isAuthenticated: action.payload.id && action.payload.email && action.payload.password ? true : false,
                user: action.payload
            }
        }
        case SET_ERRORS: {
            return {
                ...state,
                errorMsg: action.payload.error
            }
        }
        case CLEAR_ERRORS: {
            return {
                ...state,
                errorMsg: null
            }
        }
        case LOGOUT_USER: {
            return {
                ...state,
                isAuthenticated: false,
                user: {}
            }
        }
        case SET_MY_POSTS: {
            return {
                ...state,
                myPosts: action.payload
            }
        }
        default:
            return state;
    }

}

export default reducer