import React, { useState } from 'react'
import { __ } from '@wordpress/i18n'
import { Layout, Form, Icon, Button } from 'assistant/ui'
import { motion, AnimatePresence } from 'framer-motion'
import SearchSuggestions from './search-suggestions'
import Help from './help'
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
	const [ isShowingHelp, setIsShowingHelp ] = useState( false )

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
				<Layout.Row className="fl-asst-button-row">
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
							setIsShowingHelp( false )
							onFocus()
						} }
					/>
					<motion.button
						className="fluid-button fluid-shape-round fl-asst-inset-element"
						style={ {
							width: 40,
							height: 40,
							fontSize: 18,
							fontWeight: 500
						} }
						onClick={ () => setIsShowingHelp( ! isShowingHelp ) }
						layoutId="help"
					>?</motion.button>
					<Button
						icon="ellipsis"
						shape="round"
						className="fl-asst-inset-element"
						style={ { width: 40, height: 40 } }
					/>
				</Layout.Row>
			</div>
			{ ( '' !== keyword || isFocused ) && <SearchSuggestions onClick={ onSuggestionClick }/> }

			<AnimatePresence>
				{ isShowingHelp && <Help onClose={ () => setIsShowingHelp( false ) } /> }
			</AnimatePresence>
		</>
	)
}

export default HeaderBar
