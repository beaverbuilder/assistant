import { defaultCardType } from './defaults'
import arrayMove from 'array-move'

export const types = ( state = {}, action ) => {

    switch( action.type ) {
    case 'REGISTER_TYPE':

        return {
            ...state,
            [action.key]: {
                ...defaultCardType,
                ...action.config,
            }
        }
    default:
        return state
    }
}

export const pages = ( state = {}, action ) => {
    switch( action.type ) {

    case 'SET_CARDS':
        return {
            ...state,
            [ action.page ]: {
                ...state[ action.page ],
                cards: action.cards
            }
        }

    case 'SET_CARD_POSITION':

        if ( ! state[ action.page ] ) {
            return state
        }

        const page = state[ action.page ]
        const cards = page.cards

        return {
            ...state,
            [ action.page ]: {
                ...page,
                cards: arrayMove( cards, action.from, action.to )
            }
        }

    default:
        return state
    }
}
