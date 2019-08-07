import { useReducer } from 'fl-react'

export const useFormState = ( initial = {} ) => {

    const reducer = ( state, action ) => {
        switch( action.type ) {
            case 'SET_VALUE':
                const newState = { ...state }
                newState[action.key] = action.value
                return newState
        }
        return state
    }
    const [state, dispatch] = useReducer(reducer, initial)

    const setValue = ( key, value ) => dispatch({
        type: 'SET_VALUE',
        key,
        value,
    })


    return [ state, setValue ]
}
