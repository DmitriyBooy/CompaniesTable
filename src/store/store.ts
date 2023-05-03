import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import companiesReducer from './slices/CompanySlice'
import workersReducer from './slices/WorkersSlice'

export const store = configureStore({
  reducer: {
    companies: companiesReducer,
    workers: workersReducer,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
