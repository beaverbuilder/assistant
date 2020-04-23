import { useCardsState, getCardsActions } from 'fl-home/data'

const useCardTypes = () => {
    const { types } = useCardsState()
    const {} = getCardsActions()

    return Object.entries( types ).map( ( [ key, type ] ) => {

        const insert = ( listKey = 'home', position = -1 ) => {
            console.log(`Add instance of ${key} to list ${listKey} at position ${position}`)
        }

        return {
            ...type,
            insert,
        }
    })
}

export default useCardTypes
