
export const registerCardType = ( key, config = {} ) => {
    return {
        type: 'REGISTER_TYPE',
        key,
        config,
    }
}

export const addCardPage = ( key, config = {} ) => {
    return {
        type: 'ADD_PAGE',
        key,
        config,
    }
}

export const setCards = ( page, cards ) => {
    return {
        type: 'SET_CARDS',
        page,
        cards,
    }
}

export const setCardPosition = ( page, from, to ) => {
    return {
        type: 'SET_CARD_POSITION',
        page,
        from,
        to,
    }
}
