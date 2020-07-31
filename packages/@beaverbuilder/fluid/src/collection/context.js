import { createContext, useContext } from 'react'

const defaultContext = {
    appearance: 'grid'
}

const CollectionContext = createContext( defaultContext )

export default CollectionContext
