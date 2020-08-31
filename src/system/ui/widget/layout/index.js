import React, { useRef } from 'react'
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
	const { setLayout } = getWidgetActions()
	const layout = handle in layouts ? layouts[ handle ] : []
	const setWidgets = widgets => setLayout( handle, widgets )
	const [ widgets, updatePosition, updateOrder ] = useWidgetReorder( layout, setWidgets )

	if ( ! handle || ! layout ) {
		return null
	}

	return (
		<Tag className="fl-asst-widget-list" ref={ ref } { ...rest }>
			{ before }

			{ widgets.map( ( widget, i ) => {
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
