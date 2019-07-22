import {isObject} from 'lodash'

const FL_CLOUD_AUTH_STORAGE_KEY = "fl-cloud-auth";
const FL_CLOUD_USER_KEY = "fl-cloud-user";

import jwt_decode from 'jwt-decode'

export const hasToken = () => {
    return (isObject(getToken()));
}

export const getToken = () => {

    try {
        const auth = localStorage.getItem(FL_CLOUD_AUTH_STORAGE_KEY);
        return JSON.parse(auth);
    } catch(error) {
        return null;
    }

}

export const setToken = (token) => {
    token.decoded = jwt_decode(token.access_token);
    localStorage.setItem(FL_CLOUD_AUTH_STORAGE_KEY, JSON.stringify(token));

}

export const removeToken = () => {
    localStorage.removeItem(FL_CLOUD_AUTH_STORAGE_KEY);
}

