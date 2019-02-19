import React, { useContext } from 'react'
import classname from 'classnames'
import { AspectBox, ItemContext } from 'components'

export const MediaListItem = ( { className } ) => {
	const { url, urls } = useContext( ItemContext )
	const classes = classname( className, 'fl-asst-grid-item' )
	const styles = {}
	if ( 'undefined' !== typeof urls && urls.medium ) {
		styles.backgroundImage = `url(${urls.medium})`
	}
	return (
		<div className={classes}>
			<a className="fl-asst-grid-item-anchor" href={url}>
				<AspectBox style={styles} />
			</a>
		</div>
	)
}
