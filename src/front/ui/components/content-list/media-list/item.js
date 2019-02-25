import React, { useContext } from 'react'
import classname from 'classnames'
import { AspectBox, ItemContext, ViewContext, FrameContext, StackContext } from 'components'
import { MediaDetail } from './detail'

export const MediaListItem = ( { className } ) => {
	const { url, urls } = useContext( ItemContext )
	const { size } = useContext( FrameContext )
	const { pushView } = useContext( StackContext )
	const classes = classname( className, 'fl-asst-grid-item' )
	const styles = {
		flex: 'normal' === size ? '1 1 50%' : '1 1 33.3%'
	}
	const boxStyles = {}
	if ( 'undefined' !== typeof urls && urls.medium ) {
		boxStyles.backgroundImage = `url(${urls.medium})`
	}

	const item = useContext( ItemContext )
	const onClick = () => {
		const context = { ...item }
		pushView(
			<ViewContext.Provider value={context}>
				<MediaDetail />
			</ViewContext.Provider>
		)
	}

	return (
		<div className={classes} style={styles} onClick={onClick}>
			<div className="fl-asst-grid-item-anchor">
				<AspectBox style={boxStyles} />
			</div>
		</div>
	)
}
