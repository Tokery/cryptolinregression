import * as actionType from './types';

// There is a way to write this function without an explicit return statement
export const setToken = (data) => {
    return {
        type: actionType.SET_TOKEN,
        data
    }
}