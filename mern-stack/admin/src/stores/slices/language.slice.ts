import { LanguageType } from '@/types/language.type'
import { createSlice } from '@reduxjs/toolkit'

export interface LanguageState {
  language: LanguageType
}

const initialState: LanguageState = {
  language: 'vi'
}

export const languageSlice = createSlice({
  name: 'language',
  initialState: initialState,
  reducers: {
    setLanguage: (state, action: { payload: LanguageType }) => {
      console.log(action)
      state.language = action.payload
    }
  }
})

export const { setLanguage } = languageSlice.actions
export default languageSlice.reducer
