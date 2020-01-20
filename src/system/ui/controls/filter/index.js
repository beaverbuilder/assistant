import React, { useState } from 'react'
import classname from 'classnames'
import './style.scss'

const Filter = ( { className, ...rest } ) => {
	const [ isOpen, setIsOpen ] = useState( false )

	const classes = classname( {
		'fl-asst-filter': true,
	}, className )

	const style = {
		background: 'var(--fluid-box-background)',
		display: 'grid',
		gridTemplateColumns: 'repeat(3, 1fr)',
		gridAutoRows: '50px',
		gridGap: 'var(--fluid-sm-space)'
	}

	return (
		<ul className={classes} style={style}>
			<li>Child</li>
			<li>Child</li>
			<li>Child</li>
			<li>Child</li>
			<li>Child</li>
		</ul>
	)
}

export default Filter
