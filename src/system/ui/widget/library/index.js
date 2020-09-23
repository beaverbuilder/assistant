import React from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Layout } from 'ui'
import { useWidgetState, getWidgetActions } from 'data'
import './style.scss'

// Convert registered widget types into list of library items
const getLibraryItems = types => {
	const output = []

	Object.entries( types ).map( ( [ handle, item ] ) => {
		output.push( {
			type: handle,
			label: `${item.title} - Medium Size`,
			size: item.defaultSize
		} )
	} )
	return output
}

const WidgetLibrary = ( {
	layout = 'home',
	onClose = () => {}
} ) => {
	const { types } = useWidgetState( 'types' )
	const { insertWidget } = getWidgetActions()
	const items = getLibraryItems( types )

	return (
		<div className="fl-asst-widget-library">
			<Layout.Toolbar>
				<h2>{__( 'Widgets' )}</h2>
				<Button
					icon="close"
					shape="round"
					onClick={ onClose }
					style={ {
						marginLeft: 'auto',
						width: 40,
						height: 40
					} }
				/>
			</Layout.Toolbar>

			<div style={ { padding: '0 var(--fluid-med-space) 20px' } }>
				{__( 'You can drag or click items below to add new widgets to your home screen.' )}
			</div>

			<ul className="fl-asst-widget-library-items">
				{ items.map( ( item, i ) => {
					const { label } = item
					return (
						<li
							draggable
							onDragStart={ e => {

								e.dataTransfer.effectAllowed = 'copy'

								// This allows us to check if its a widget being dragged before drop
								e.dataTransfer.setData( 'fl-asst-widget', 'true' )

								// Transfer the widget configuration object as a string
								e.dataTransfer.setData( 'text/plain', JSON.stringify( item ) )
							} }
							key={ i }
							onClick={ () => insertWidget( layout, item ) }
						>{label}</li>
					)
				} ) }
			</ul>
		</div>
	)
}

export default WidgetLibrary
