import React, { useRef, useState } from 'react'
import c from 'classnames'
import { __ } from '@wordpress/i18n'
import useWidgetReorder from './use-widget-reorder'
import { useWidgetState, getWidgetActions } from 'data'
import Item from '../item'

const defaultWidgetType = {
	title: 'Untitled',
	render: () => null
}

const WidgetLayout = ( {
	tag: Tag = 'ul',
	handle,
	before,
	after,
	...rest
} ) => {
	const ref = useRef( null ) // Container ref for drag boundary
	const { types, layouts } = useWidgetState()
	const { setLayout, insertWidget } = getWidgetActions()
	const layout = handle in layouts ? layouts[ handle ] : []
	const setWidgets = widgets => setLayout( handle, widgets )
	const [ widgets, updatePosition, updateOrder ] = useWidgetReorder( layout, setWidgets )

	//const [ isDraggingOver, setIsDraggingOver ] = useState( false )

	if ( ! handle || ! layout ) {
		return null
	}

	const onDragEnter = e => {

		// Cuts down on the number of times it fires
		// No need to worry about child items
		if ( ! e.target.classList.contains( 'fl-asst-widget-list' ) ) {
			return
		}

		// Do we have a valid widget item being dragged?
		// You can't simply read the dataTransfer value before drop #becausesecurity
		if ( e.dataTransfer.types.includes( 'fl-asst/widget' )  ) {
			e.dataTransfer.dropEffect = 'copy'
		}
	}

	// Required for drop listening
	const onDragOver = e => e.preventDefault()

	// Insert the dropped widget
	const onDrop = e => {
		e.preventDefault()

		// Lets make sure it really is a widget
		// Our library should include a widget type string - fl-asst/widget
		if ( event.dataTransfer.types.includes( 'fl-asst/widget' )  ) {

			// Let's make sure there is actual JSON data here
			const data = e.dataTransfer.getData( 'fl-asst/widget' )
			if ( ! data || ! data.startsWith( '{' ) ) {
				return false
			}

			const item = JSON.parse( data )
			insertWidget( handle, item )
		}
	}

	return (
		<Tag
			className={ c( 'fl-asst-widget-list' ) }
			ref={ ref }
			onDragEnter={ onDragEnter }
			onDragOver={ onDragOver }
			onDrop={ onDrop }
			{ ...rest }
		>
			{ before }

			{ 0 === widgets.length && (
				<li style={ {
					margin: 'auto',
					flex: '1 1 auto',
					minHeight: 300,
					justifyContent: 'center'
				} }>{__( 'No widgets, bummer. Hit the + and add some.' )}</li>
			) }

			{ 0 < widgets.length && widgets.map( ( widget, i ) => {
				const type = ( 'type' in widget && widget.type in types ) ? types[ widget.type ] : defaultWidgetType
				const rest = { ...type, ...widget }

				return (
					<Item
						key={ widget.id }
						i={ i }
						wrap={ ref }
						setDimensions={ updatePosition }
						updateOrder={ updateOrder }
						{ ...rest }
					/>
				)
			} ) }

			{ after }
		</Tag>
	)
}

export default WidgetLayout
