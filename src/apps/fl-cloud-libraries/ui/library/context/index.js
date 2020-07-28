import { createContext, useContext } from 'react'

const LibraryContext = createContext()

LibraryContext.use = () => useContext( LibraryContext )

export default LibraryContext
