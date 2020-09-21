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
					style={ { marginLeft: 'auto' } }
				/>
			</Layout.Toolbar>

			<ul className="fl-asst-widget-library-items">
				{ items.map( ( item, i ) => {
					const { label } = item
					return (
						<li
							draggable
							onDragStart={ e => {
								const data = { dragType: 'widget', ...item }
								e.dataTransfer.setData( 'text/plain', JSON.stringify( data ) )
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
