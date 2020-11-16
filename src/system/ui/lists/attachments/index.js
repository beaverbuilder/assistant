import React, { useState, useEffect } from 'react'
import classname from 'classnames'
import { __ } from '@wordpress/i18n'
import { List, Button, Icon, Image, Media, Layout } from 'ui'
import Clipboard from 'react-clipboard.js'
import { getSystemSelectors } from 'data'
import { getWpRest } from 'utils/wordpress'
import { getSrcSet } from 'utils/image'
import './style.scss'

const Attachments = ( {
	baseURL,
	listStyle = '',
	className,
	...rest
} ) => {
	const { getLabels } = getSystemSelectors()
	const [ labelsById, setLabelsById ] = useState( [] )
	const wpRest = getWpRest()
	const labels = getLabels()

	// Retrieve labels by ID
	useEffect( () => {
		const items = {}
		labels.map( label => items[ label.id ] = label )
		setLabelsById( items )
	}, [ labels ] )

	const classes = classname( {
		[`fl-asst-${listStyle}-list`]: listStyle,
		'fl-asst-attachment-list': true,
	}, className )

	return (
		<Media.Uploader>
			<List.WordPress
				type="attachments"
				className={ classes }
				getItemProps={ ( item, defaultProps ) => {
					const { updateItem } = defaultProps
					const trashItem = () => {
						if ( confirm( __( 'Do you really want to trash this item?' ) ) ) {

							wpRest.attachments().update( item.id, 'trash' ).then( () => {
								updateItem( item.uuid, {
									title: __( 'This item has been deleted!' ),
									isTrashing: true,
									isTrashed: true,
								} )
							} )

						}
					}
					const Extras = () => (
						<div className="fl-asst-item-extras">
							<Button
								title={ __( 'View Attachment Page' ) }
								tabIndex="-1"
								href={ item.permalink }
								appearance="transparent"
							>
								<Icon.View />
							</Button>
							<Clipboard
								title={ __( 'Copy URL' ) }
								button-tabIndex={ '-1' }
								button-className={ 'fluid-button fluid-appearance-transparent' }
								data-clipboard-text={ item.url }
							>
								<Icon.Link />
							</Clipboard>
							<Button
								title={ __( 'Edit in Admin' ) }
								tabIndex="-1"
								href={ item.editUrl }
								appearance="transparent"
							>
								<Icon.Edit />
							</Button>
							<Button
								onClick={ trashItem }
								tabIndex="-1"
								title={ __( 'Move to Trash' ) }
								status='destructive'
								appearance="transparent"
							>
								<Icon.Trash />
							</Button>
						</div>
					)

					const getMarks = item => {
						const marks = []

						if ( 'labels' in item && 0 < item.labels.length ) {

							item.labels.map( id => {
								if ( id in labelsById ) {
									const { color, label } = labelsById[id]
									marks.push(
										<span
											className="fl-asst-list-item-color-mark"
											style={ { background: color } }
											title={ label }
										></span>
									)
								}
							} )
						}

						if ( 'isFavorite' in item && item.isFavorite ) {
							marks.push(
								<span>
									<Icon.Bookmark style={ { height: 12, width: 12, marginTop: 2 } } />
								</span>
							)
						}

						return marks
					}

					const ThumbIcon = () => {
						const { type, subtype, thumbnail } = item
						const isDocument = ( 'application' === type || ( 'pdf' === subtype && ! thumbnail ) )

						if ( item.isTrashed ) {
							return (
								<div className="fl-asst-list-thumb-icon" style={ { color: 'var(--fluid-destructive-color)' } }>
									<Icon.Trash />
								</div>
							)
						}

						return (
							<div className="fl-asst-list-thumb-icon">
								{ 'video' === type && <Icon.Video /> }
								{ 'audio' === type && <Icon.Audio /> }
								{ isDocument && <Icon.Document /> }
							</div>
						)
					}

					return {
						...defaultProps,
						thumbnailSize: 'lg',
						thumbnail: ( null !== item.thumbnail && ! item.isTrashed ) ? item.thumbnail : <ThumbIcon />,
						shouldAlwaysShowThumbnail: true,
						label: item.title ? item.title : __( 'Untitled' ),
						description: item.isTrashed ? '' : item.type + ' | ' + item.subtype,
						to: item.isTrashed ? '' : {
							pathname: `${baseURL}/attachment/${item.id}`,
							state: { item }
						},
						extras: () =>  item.isTrashed ? '' : <Extras />,
						marks: getMarks( item ),
						className: classname( {
							['fl-asst-grid-list-item']: 'grid' === listStyle,
							'fl-asst-grid-item-is-favorite': item.isFavorite,
						}, defaultProps.className ),
						children: 'grid' === listStyle ? props => <GridItem item={ item } { ...props } /> : defaultProps.children,
					}
				} }
				{ ...rest }
			/>
		</Media.Uploader>
	)
}

const GridItem = ( { item, extras } ) => {
	const { type, thumbnail, sizes, alt, title } = item

	const isDocument = ( 'application' === type || ( 'pdf' === item.subtype && ! thumbnail ) )

	const itemExtras = 'function' === typeof extras ? extras() : null
	const stopProp = e => e.stopPropagation()

	// Filter down to just the smaller sizes for srcset
	const smallSizes = {}
	const allow = [ 'thumbnail', 'medium' ]
	for ( let key in sizes ) {
		if ( allow.includes( key ) ) {
			smallSizes[key] = sizes[key]
		}
	}
	return (
		<Layout.AspectBox
			className="fl-asst-attachment-grid-item" style={ { width: '100%' } }
		>
			<div className="fl-asst-list-thumb-icon"
				style={ {
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					opacity: ( item.isTrashed || item.isTrashing ) ? .5 : 1
				} }
			>
				{ ( 'image' === type || 'pdf' === item.subtype ) &&
					thumbnail && (
					<img
						src={ thumbnail }
						srcSet={ getSrcSet( smallSizes ) }
						alt={ alt }
						title={ title }
						loading="lazy"
						height={ 157.5 }
						width={ 157.5 }
					/>
				)}

				{ 'video' === type && <Image.Video /> }
				{ 'audio' === type && <Image.Audio /> }
				{ isDocument && <Image.Doc /> }

				{ item.title && ( <div className="fl-asst-attachment-item-badge">
					<span>{item.title}</span>
				</div> )}
				{ itemExtras && (
					<div
						className="fl-asst-list-item-extras"
						onClick={ stopProp }
					>{itemExtras}</div>
				) }
			</div>
		</Layout.AspectBox>
	)
}

export default Attachments
