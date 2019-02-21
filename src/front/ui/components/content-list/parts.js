import React, { useContext } from 'react'
import classname from 'classnames'
import Truncate from 'react-truncate'
import useMeasure from "use-measure"
import { EmptyMessage, ItemContext } from 'components'

export const ContentListContainer = ( { className, children } ) => {
	return (
		<div className={ classname( className, 'fl-asst-list' ) }>
			{ children }
		</div>
	)
}

export const ContentListGroupLabel = ( { label } ) => {
	return (
		<div className='fl-asst-list-group-heading'>
			{ label }
		</div>
	)
}

export const ContentListItem = props => {
	const { meta, thumbnail, title } = useContext( ItemContext ) || {}
	const [ref, bounds] = useMeasure()
	const { className, children, onClick } = props
	const classes = classname( className, 'fl-asst-list-item' )
	const thumbStyles = {
		backgroundImage: thumbnail ? `url(${ thumbnail })` : '',
	}

	const contentLineCount = 2

	return (
		<div className={ classes } onClick={ onClick }>
			<div className="fl-asst-list-item-visual">
				<div className="fl-asst-list-item-image-box" style={ thumbStyles }></div>
			</div>
			<div className="fl-asst-list-item-content" ref={ref}>
				<div className="fl-asst-list-item-title">
					<Truncate lines={contentLineCount} width={bounds.width}>{title}</Truncate>
				</div>
				<div className="fl-asst-list-item-meta">
					{ meta }
				</div>
			</div>
			{children}
		</div>
	)
}

export const ContentListItemLoading = ( { className } ) => {
	const context = {
		meta: 'Loading...',
		title: 'Loading...',
	}
	const classes = classname( className, 'fl-asst-list-item-loading' )
	return (
		<ItemContext.Provider value={ context }>
			<ContentListItem className={ classes } />
		</ItemContext.Provider>
	)
}

export const ContentListDetail = ( { className, children } ) => {
	return (
		<div className={ classname( className, 'fl-asst-list-detail' ) }>
			{ children }
		</div>
	)
}

export const ContentListEmptyMessage = () => {
	return <EmptyMessage>No Results Found</EmptyMessage>
}
