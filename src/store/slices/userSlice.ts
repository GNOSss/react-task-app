import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  email: '',
  id: '',
  displayName: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    setUser: (state, action) => {
      state.email = action.payload.email;
      state.id = action.payload.id;
      state.displayName = action.payload.displayName;
    },
    removeUser: (state) => {
      state.email = '';
      state.id = '';
      state.displayName = '';
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
