import React, { useState } from 'react'
import { __ } from '@wordpress/i18n'
import { Form, Icon, Button, Widget, Menu } from 'assistant/ui'
import { useSystemState, getSystemActions } from 'assistant/data'
import SearchSuggestions from './search-suggestions'
import './style.scss'

const noop = () => {}

const HeaderBar = ( {
	onFocus = noop,
	onClear = noop,
	onInput = noop,
	onSuggestionClick = noop,
	keyword = '',
} ) => {
	const [ isFocused, setIsFocused ] = useState( false )
	const [ isShowingWidgetLib, setIsShowingWidgetLib ] = useState( false )

	const SearchIcon = () => (
		<span className="search-icon-wrapper">
			<Icon.Search />
		</span>
	)

	const Back = () => {
		return (
			<Button
				appearance="transparent"
				className="fl-asst-home-search-clear"
				onClick={ () => {
					setIsFocused( false )
					onClear()
				} }
			>
				<Icon.BackArrow />
			</Button>
		)
	}

	return (
		<>
			<div className="fl-asst-home-search-header fluid-sticky-element" >
				<Form.Input
					className="fl-asst-inset-element"
					before={ '' !== keyword ? <Back /> : <SearchIcon /> }
					value={ keyword }
					placeholder={ __( 'Search WordPress' ) }
					onInput={ e => {
						onInput( e.target.value )
						if ( '' === e.target.value ) {
							onClear()
						}
					} }
					onFocus={ () => {
						setIsFocused( true )
						onFocus()
					} }
				/>
				<Button
					appearance="transparent"
					href="/wp-admin"
					shape="round"
					target="_blank"
					style={ { width: 40, height: 40 } }
				>
					<Icon.WordPress />
				</Button>
				<MoreMenu />
			</div>
			{ ( '' !== keyword || isFocused ) && <SearchSuggestions onClick={ onSuggestionClick } /> }
			{ isShowingWidgetLib && <Widget.Library onClose={ () => setIsShowingWidgetLib( false ) } /> }
		</>
	)
}

const ColorSchemeMenuItem = () => {
	const { appearance } = useSystemState( 'appearance' )
	const { setBrightness } = getSystemActions()
	const toggleColorScheme = () => {
		setBrightness( 'dark' === appearance.brightness ? 'light' : 'dark' )
	}

	return (
		<Menu.Item onClick={ toggleColorScheme }>
			{ __( 'Toggle Color Scheme' ) }
		</Menu.Item>
	)
}

const MoreMenu = () => {
	const [ isShowing, setIsShowing ] = useState( false )

	const MenuContent = () => {
		return (
			<>
				<ColorSchemeMenuItem />
			</>
		)
	}

	return (
		<Menu
			content={ <MenuContent /> }
			isShowing={ isShowing }
			onOutsideClick={ () => setIsShowing( false ) }
			style={ { zIndex: 9 } }
		>
			<Button
				appearance="transparent"
				shape="round"
				style={ { width: 40, height: 40 } }
				onClick={ () => setIsShowing( ! isShowing ) }
			>
				<Icon.More />
			</Button>
		</Menu>
	)
}

export default HeaderBar
