import { createContext } from 'react'

export const CurrentPageViewContext = createContext( FLAssistantInitialData.currentPageView )
CurrentPageViewContext.displayName = 'CurrentPageViewContext'

export const CurrentTabContext = createContext()
CurrentTabContext.displayName = 'CurrentTabContext'

export const UIContext = createContext()
UIContext.displayName = 'UIContext'
