import React, { useContext } from 'react'
import { Tunnel } from 'react-tunnels'
import { UIContext } from 'components'

export const Header = props => {
	const { activeAppName } = useContext( UIContext )
	return <Tunnel id={ `app-header-${activeAppName}` } { ...props } />
}

Header.Expanded = props => {
	const { activeAppName } = useContext( UIContext )
	return <Tunnel id={ `app-header-expanded-${activeAppName}` } { ...props } />
}
