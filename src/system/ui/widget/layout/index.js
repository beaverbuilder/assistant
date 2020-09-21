import React, { useRef } from 'react'
import c from 'classnames'
import { __ } from '@wordpress/i18n'
import useWidgetReorder from './use-widget-reorder'
import { useWidgetState, getWidgetActions } from 'data'
import { Layout } from 'ui'
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

	if ( ! handle || ! layout ) {
		return null
	}

	const onDragOver = e => {
		e.preventDefault()
	}

	const onDrop = e => {
		e.preventDefault()
		const data = e.dataTransfer.getData( 'text/plain' )
		if ( ! data || ! data.startsWith( '{' ) ) {
			return false
		}
		const item = JSON.parse( data )

		if ( 'dragType' in item && 'widget' === item.dragType ) {
			insertWidget( handle, item )
		}
	}

	return (
		<Tag
			className={ c( 'fl-asst-widget-list', {
				'is-over': false
			} ) }
			ref={ ref }
			onDragOver={ onDragOver }
			onDragEnter={ e => e.preventDefault() }
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
