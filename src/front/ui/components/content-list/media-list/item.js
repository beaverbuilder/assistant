import React from 'react'
import classname from 'classnames'
import { AspectBox } from 'components'

export const MediaListItem = ( { className, data } ) => {
	const { url, urls } = data
	const classes = classname( className, 'fl-asst-grid-item' )
	const styles = {
		backgroundImage: `url(${urls.medium})`
	}
	return (
		<div className={classes}>
			<a className="fl-asst-grid-item-anchor" href={url}>
				<AspectBox style={styles} />
			</a>
		</div>
	)
}
