import { createSlice } from '@reduxjs/toolkit';
import { User } from '../../types';

const initialState = {
    user : {} as User,
};

const userSlice = createSlice({
    name: 'locations',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
    },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;