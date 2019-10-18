import React, { useState } from 'fl-react'
import classname from 'fl-classnames'
import { Manager, Reference, Popper } from 'react-popper'
import './style.scss'

export const FilterBar = ( { className, children, ...rest } ) => {
	const classes = classname( {
		'fl-asst-filter-bar': true,
	}, className )
	return (
		<div className={ classes } { ...rest }>
			<Filter />
			<Filter />
			<Filter />
			{children}
		</div>
	)
}

export const Filter = ( { className, ...rest } ) => {
	const [ isOpen, setIsOpen ] = useState( false )

	const classes = classname( {
		'fl-asst-filter-bar-item': true,
	}, className )

	return (
		<Manager>
			<Reference>
				{( { ref } ) => (
					<button
						type="button"
						ref={ ref }
						className={ classes }
						onClick={ () => setIsOpen( ! isOpen ) }
						{ ...rest }
					>
                        Test
					</button>
				)}
			</Reference>
			{ isOpen && <Popper placement="bottom">
				{( { ref, style, placement, arrowProps } ) => (
					<div
						ref={ ref }
						style={ style }
						data-placement={ placement }
						className="fl-asst-filter-bar-menu"
					>
                    Popper element
						<div ref={ arrowProps.ref } style={ arrowProps.style } />
					</div>
				)}
			</Popper> }
		</Manager>
	)
}
