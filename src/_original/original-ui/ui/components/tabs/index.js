import React, { useState } from 'react'
import classname from 'classnames'
import { Button } from 'components'
import './style.scss'

export const Tabs = props => {
	const { tabs = [], placement = 'beside', className } = props
	const [ index, setIndex ] = useState( 0 )

	const { content } = tabs[ index ]

	const classes = classname( {
		'fl-asst-tabs': true,
		[`fl-asst-tabs-${placement}`]: placement
	}, className )

	return (
		<div className={classes}>
			<div className="fl-asst-tab-list">
				<ul>
					{ tabs.map( ( item, i ) => {
						const { label, icon } = item
						return (
							<li key={i}>
								<Button
									isSelected={ i === index }
									onClick={ () => setIndex( i )}
								>
									{ icon && <span className="fl-asst-tab-item-icon">{icon}</span> }
									{label}
								</Button>
							</li>
						)
					} )}
				</ul>
			</div>
			<div className="fl-asst-tab-content">{content}</div>
		</div>
	)
}
