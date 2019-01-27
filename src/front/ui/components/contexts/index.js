import React, { createContext } from 'react'
import store from 'store'

export const CurrentPageViewContext = React.createContext( store.getState().currentPageView );

export const CurrentTabContext = createContext()
