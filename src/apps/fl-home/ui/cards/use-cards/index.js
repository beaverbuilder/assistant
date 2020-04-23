import { useState } from 'react'
import { useCardsState, getCardsActions } from 'fl-home/data'

const useCards = initialPage => {
	const [ page, setPage ] = useState( initialPage )
	const { pages, types } = useCardsState()
	const { setCardPosition, setCards } = getCardsActions()
	let cards = []

	if ( pages[ page ] ) {

		// Any visibility checks should happen here
		cards = pages[ page ].cards.filter( card => Object.keys( types ).includes( card.type ) )

		// Map custom properties & functions to item
		cards = cards.map( ( card, i ) => {
			const type = types[ card.type ]

			const isFirst = 0 === i
			const isLast = i === cards.length - 1

			const move = ( dir = 'up' ) => {
				if ( isFirst && 'up' === dir ) {
					return false
				}
				if ( isLast && 'down' === dir ) {
					return false
				}

				const from = i
				const to = 'up' === dir ? i - 1 : i + 1
				setCardPosition( page, from, to )
			}

			return {
				...card,
				...type,
				title: card.title ? card.title : type.label,
				icon: type.icon,
				isFirst,
				isLast,
				moveUp: () => move( 'up' ),
				moveDown: () => move( 'down' ),
				setPosition: to => setCardPosition( page, i, to ),
				render: type.render,
				edit: type.edit,
			}
		} )
	}

	return {
		setPage,
		cards,
		setCards: cards => setCards( page, cards )
	}
}

export default useCards
