import { createSlice } from '@reduxjs/toolkit';
import { User } from '../../types';

const initialState = {
    user : {} as User,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        updateUser: (state, action) => {
            const updatedFields = action.payload;
            console.log('updateUser', updatedFields);
            state.user = {
                ...state.user,
                ...updatedFields,
            };
            console.log('state', state.user);
        },
    },
});

export const { setUser, updateUser } = userSlice.actions;
export default userSlice.reducer;