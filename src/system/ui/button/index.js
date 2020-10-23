import React from 'react'
import classname from 'classnames'
import { Button as FLUID_Button } from '@beaverbuilder/fluid'
import { Icon } from 'ui'
import './style.scss'

const Button = { ...FLUID_Button }

Button.Loading = ( {
	className,
	children,
	isLoading = true,
	appearance = 'normal',
	...rest
} ) => {
	const classes = classname( {
		'fl-asst-button-loading': true,
	}, className )

	return (
		<Button appearance={ appearance } className={ classes } { ...rest }>
			{ children }
			{ isLoading && <Icon.Loading /> }
		</Button>
	)
}

Button.renderActions = actions => {
	const defaultAction = {
		label: null,
		shouldRender: true,
		isEnabled: true,
	}
	return Object.values( actions ).map( ( action, i ) => {
		const { label, shouldRender, isEnabled, ...rest } = { ...defaultAction, ...action }

		if ( ! shouldRender || ! isEnabled ) {
			return null
		}

		return (
			<Button key={ i } appearance="normal" { ...rest }>{label}</Button>
		)
	} )
}

/*
const capitalize = value => value.charAt( 0 ).toUpperCase() + value.slice( 1 )

const matchIcon = value => {
	const Icon = {}
	if ( 'string' === typeof value ) {
		const name = capitalize( camelcase( value ) )
		if ( Object.keys( Icon ).includes( name ) ) {
			const FoundIcon = Icon[name]
			return <FoundIcon />
		}
	}
	return value
}*/

export default Button
