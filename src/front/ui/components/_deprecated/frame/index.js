import React, { Fragment } from 'react'
import classname from 'classnames'
import { Padding } from 'components'
import './style.scss'


export const ContentFrame = props => {
	const { className, padded = false, align } = props

	const classes = classname( {
		'fl-asst-content-frame': true,
		'fl-asst-content-frame-align-center': 'center' === align,
	}, className )

	const mergedProps = Object.assign( {}, props, {
		className: classes,
	} )
	delete mergedProps.align

	return (
		<Fragment>
			{ padded && <Padding>
				<div {...mergedProps} />
			</Padding> }
			{ ! padded && <div {...mergedProps} /> }
		</Fragment>
	)
}
