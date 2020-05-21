import React from 'react'
import classname from 'classnames'
import { Button, Icon } from 'assistant/ui'

const Actions = ( { items = [] } ) => {

	if ( ! items || 1 > items.length ) {
		return null
	}

	return (
		<div className="fl-asst-item-extras">
			{ items.map( ( item, i ) => {
				const action = {
					handle: '',
					icon: <Icon.Placeholder />,
					isShowing: true,
					component: Button,
					appearance: 'transparent',
					tabIndex: -1,
					...item
				}
				const {
					component: Component,
					isShowing,
					icon,
					handle,
					className,
					...rest
				} = action

				if ( 'function' === typeof isShowing && ! isShowing( item ) ) {
					return null
				} else if ( ! isShowing ) {
					return null
				}

				const classes = classname( { [`fl-asst-item-action-${handle}`]: handle }, className )

				return (
					<Component
						key={ i }
						className={ classes }
						{ ...rest }
					>{icon}</Component>
				)
			} )}
		</div>
	)
}

export default Actions
