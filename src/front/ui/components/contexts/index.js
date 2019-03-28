import { createContext } from 'react'

export const UIContext = createContext()
UIContext.displayName = 'UIContext'

export const AppContext = createContext()
AppContext.displayName = 'AppContext'

export const PageViewContext = createContext()
PageViewContext.displayName = 'PageViewContext'

export const ViewContext = createContext()
ViewContext.displayName = 'ViewContext'

export const ItemContext = createContext( {} )
ItemContext.displayName = 'ItemContext'
