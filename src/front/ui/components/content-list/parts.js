import React, { useContext } from 'react'
import classname from 'classnames'
import {
	EmptyMessage,
	Padding,
	ScreenHeader,
	StackContext,
	Button,
	Icon,
	TagGroup,
	Tag,
} from 'components'

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
	const { className, children, data, onClick, onAccessoryClick } = props
	const { meta, thumbnail, title } = data
	const { pushView } = useContext( StackContext )

	const thumbStyles = {
		backgroundImage: thumbnail ? `url(${ thumbnail })` : '',
	}

	const handleClick = () => {
		if ( onClick ) {
			onClick( data )
		} else {
			pushView( <ContentListDetail data={ data } /> )
		}
	}

	return (
		<div className={ classname( className, 'fl-asst-list-item' ) } onClick={ e => handleClick( props, e ) }>
			<div className="fl-asst-list-item-visual">
				<div className="fl-asst-list-item-image-box" style={ thumbStyles }></div>
			</div>
			<div className="fl-asst-list-item-content">
				<div className="fl-asst-list-item-title">{ title }</div>
				<div className="fl-asst-list-item-meta">
					{ meta }
				</div>
			</div>
			<div className="fl-asst-list-item-accessory">
				{ onAccessoryClick && <Button appearance="icon" onClick={ e => onAccessoryClick( props, e ) }>
					<Icon name="forward" />
				</Button> }
			</div>
			{children}
		</div>
	)
}

export const ContentListItemLoading = ( { className } ) => {
	const data = {
		meta: 'Loading...',
		title: 'Loading...',
	}
	return (
		<ContentListItem
			className={ classname( className, 'fl-asst-list-item-loading' ) }
			data={ data }
		/>
	)
}

export const ContentListEmptyMessage = () => {
	return <EmptyMessage>No Results Found</EmptyMessage>
}

export const ContentListDetail = ( { className, data } ) => {
	const { meta, title, url, edit_url } = data

	return (
		<div className={ classname( className, 'fl-asst-list-detail' ) }>
			<ScreenHeader title={title}>
				<TagGroup>
					<Tag href={url}>View</Tag>
					<Tag href={edit_url}>Edit</Tag>
				</TagGroup>
			</ScreenHeader>
			<Padding>
				<div>By { meta }</div>
			</Padding>
		</div>
	)
}
