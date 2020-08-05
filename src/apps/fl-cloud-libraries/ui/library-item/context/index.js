import { createContext, useContext } from 'react'

const ItemContext = createContext()

ItemContext.use = () => useContext( ItemContext )

export default ItemContext
