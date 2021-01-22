import axios from "../axios/axios";
// import history from "../history";
import jwt_decode from "jwt-decode";
import {
    SET_CURRENT_USER,
    SET_ERRORS,
    CLEAR_ERRORS,
    LOGOUT_USER,
    SET_MY_POSTS,
    SET_ALL_POSTS,
    SET_MY_FOLLOWING,
} from "./actionTypes";

export const loginUser = (userData, history) => {
    return (dispatch) => {
        const data = {
            email: userData.email,
            password: userData.password,
        };
        axios
            .post("/api/login", data)
            .then((res) => {
                if (res.data.token) {
                    localStorage.setItem("instagram", res.data.token);
                    const decoded = jwt_decode(res.data.token);
                    clearErrors();
                    dispatch({
                        type: SET_CURRENT_USER,
                        payload: decoded,
                    });
                    history.push("/");
                } else {
                    dispatch({
                        type: SET_ERRORS,
                        payload: res.data,
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };
};

export const signupUser = (userData, history) => {
    return (dispatch) => {
        const data = {
            name: userData.name,
            email: userData.email,
            password: userData.password,
            profilePic: userData.profilePic,
        };
        axios
            .post("/api/register", data)
            .then((res) => {
                if (res.data.message) {
                    dispatch({
                        type: CLEAR_ERRORS,
                    });
                    history.push("/login");
                } else {
                    let data = {
                        error: res.data.error ? res.data.error : res.data.errors[0].msg,
                    };
                    dispatch({
                        type: SET_ERRORS,
                        payload: data,
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };
};

export const clearErrors = () => {
    return (dispatch) => {
        dispatch({
            type: CLEAR_ERRORS,
        });
    };
};

export const logoutUser = () => {
    return (dispatch) => {
        localStorage.removeItem("instagram");
        dispatch({
            type: LOGOUT_USER,
        });
        window.location.href = "/login";
    };
};

export const loginAfter = () => {
    return (dispatch) => {
        const token = localStorage.getItem("instagram");
        if (token) {
            let decoded = jwt_decode(token);
            if (
                decoded.id &&
                decoded.email &&
                decoded.password &&
                decoded.iat &&
                decoded.exp
            ) {
                dispatch({
                    type: SET_CURRENT_USER,
                    payload: decoded,
                });
            }
        } else {
            dispatch({
                type: LOGOUT_USER,
            });
        }
    };
};

//Posts
export const setMyPosts = (payload) => {
    return (dispatch) => {
        dispatch({
            type: SET_MY_POSTS,
            payload,
        });
    };
};

export const setAllPosts = (payload) => {
    return (dispatch) => {
        dispatch({
            type: SET_ALL_POSTS,
            payload,
        });
    };
};

export const setMyFollowing = (payload) => {
    return (dispatch) => {
        dispatch({
            type: SET_MY_FOLLOWING,
            payload,
        });
    };
};