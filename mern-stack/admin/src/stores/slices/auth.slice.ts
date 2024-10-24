import { createSlice } from '@reduxjs/toolkit'

export type InitialState = {
  accessToken: string
}

const initialState: InitialState = {
  accessToken: ''
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload
    }
  }
})

export const { setAccessToken } = authSlice.actions

export default authSlice.reducer
