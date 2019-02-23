import React, { useContext } from 'react'
import classname from 'classnames'
import { AspectBox, ItemContext, FrameContext } from 'components'

export const MediaListItem = ( { className } ) => {
	const { url, urls } = useContext( ItemContext )
	const { size } = useContext( FrameContext )
	const classes = classname( className, 'fl-asst-grid-item' )
	const styles = {
		flex: 'normal' === size ? '1 1 50%' : '1 1 33.3%'
	}
	const boxStyles = {}
	if ( 'undefined' !== typeof urls && urls.medium ) {
		boxStyles.backgroundImage = `url(${urls.medium})`
	}
	return (
		<div className={classes} style={styles}>
			<a className="fl-asst-grid-item-anchor" href={url}>
				<AspectBox style={boxStyles} />
			</a>
		</div>
	)
}
