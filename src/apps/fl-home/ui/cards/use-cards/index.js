import { useState } from 'react'
import { useCardsState, getCardsActions } from 'fl-home/data'

const useCards = initialPage => {
    const [page, setPage] = useState( initialPage )
    const { pages } = useCardsState()
    const { setCardPosition, setCards } = getCardsActions()
    let cards = []

    if ( pages[ page ] ) {

        // Any visibility checks should happen here
        cards = pages[ page ].cards.filter( () => true )

        // Map custom properties & functions to item
        cards = cards.map( ( card, i ) => {

            const isFirst = i === 0
            const isLast = i === cards.length - 1

            const move = ( dir = 'up' ) => {
                if ( isFirst && 'up' === dir ) return false
                if ( isLast && 'down' === dir ) return false

                const from = i
                const to = 'up' === dir ? i - 1 : i + 1
                setCardPosition( page, from, to )
            }

            return {
                ...card,
                isFirst,
                isLast,
                moveUp: () => move('up'),
                moveDown: () => move('down'),
                setPosition: to => setCardPosition( page, i, to )
            }
        })
    }

    return {
        setPage,
        cards,
        setCards: cards => setCards( page, cards )
    }
}

export default useCards
