import React from 'react'
import classname from 'classnames'
import { Button } from 'components'
import './style.scss'

export const TabBar = props => {
	const { tabs } = props
	const classes = classname({
		'fl-asst-tab-bar': true
	})
	return (
		<div className={ classes }>
			{ tabs.map( ( tab, index ) =>
				<Button
					key={ index }
					isSelected={ tab.isSelected }
					onClick={ tab.onClick }
				>
					{ tab.label }
				</Button>
			) }
		</div>
	)
}
