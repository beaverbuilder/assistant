import { useCardsState, getCardsActions } from 'fl-home/data'

const useCardTypes = () => {
    const { types } = useCardsState()
    const { createCard } = getCardsActions()

    return Object.entries( types ).map( ( [ key, type ] ) => {

        const insert = ( page = 'home' ) => {
            createCard( page, {
                id: Date.now(),
                type: key,
            })
        }

        return {
            ...type,
            insert,
        }
    })
}

export default useCardTypes
