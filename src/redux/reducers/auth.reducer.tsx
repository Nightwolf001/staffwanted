import { createSlice } from '@reduxjs/toolkit';
import { Auth } from '../../types';

const initialState = {
    auth: {} as Auth,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, action) => {
            state.auth = action.payload
        },
    },
});

export const { setAuth } = authSlice.actions;
export default authSlice.reducer;