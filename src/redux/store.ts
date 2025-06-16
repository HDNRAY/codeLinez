import { configureStore, type ThunkAction, type Action } from '@reduxjs/toolkit'
import { useDispatch, type TypedUseSelectorHook, useSelector } from 'react-redux'
import game from './game'

export const store = configureStore({
    reducer: {
        game: game,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
