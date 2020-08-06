import { createContext } from 'react'

const defaultContext = {
	appearance: 'grid'
}

const CollectionContext = createContext( defaultContext )

export default CollectionContext
