import React, { useState, useEffect } from 'react'
import classname from 'classnames'
import { CancelToken, isCancel } from 'axios'
import { __ } from '@wordpress/i18n'
import { List, Button, Icon, Image, MediaDropUploader } from 'ui'
import Clipboard from 'react-clipboard.js'
import { getWpRest } from 'utils/wordpress'
import { getSrcSet } from 'utils/image'
import './style.scss'

const Attachments = ( {
	baseURL,
	listStyle = '',
	className,
	...rest
} ) => {
	const [ labels, setLabels ] = useState( {} )
	const wpRest = getWpRest()
	const source = CancelToken.source()

	// Retrieve Labels
	useEffect( () => {

		// Get the color labels references
		wpRest.labels().findWhere( {}, {
			cancelToken: source.token,
		} ).then( response => {
			const items = {}
			if ( 'data' in response ) {
				for ( let i in response.data ) {
					const { id, ...rest } = response.data[i]
					items[id] = rest
				}
				setLabels( items )
			}
		} ).catch( ( error ) => {
			if ( ! isCancel( error ) ) {
				console.log( error ) // eslint-disable-line no-console
			}
		} )

		return () => source.cancel()
	}, [] )

	const classes = classname( {
		[`fl-asst-${listStyle}-list`]: listStyle,
		'fl-asst-attachment-list': true,
	}, className )


	return (
		<MediaDropUploader>
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
								href={ item.url }
								appearance="transparent"
							>
								<Icon.View />
							</Button>
							<Clipboard
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
								if ( id in labels ) {
									const { color, label } = labels[id]
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
						const { type } = item
						return (
							<div style={ { padding: 5 } }>
								{ 'video' === type && <Icon.Video /> }
								{ 'audio' === type && <Icon.Audio /> }
								{ 'application' === type && 'pdf' !== item.subtype && (
									<Icon.Document />
								)}
							</div>
						)
					}

					return {
						...defaultProps,
						thumbnail: item.isTrashed ? '' : ( null !== item.thumbnail ? item.thumbnail : <ThumbIcon /> ),
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
		</MediaDropUploader>
	)
}

const GridItem = ( { item, extras } ) => {
	const { type, thumbnail, sizes, alt, title } = item

	const itemExtras = 'function' === typeof extras ? extras() : null
	const stopProp = e => e.stopPropagation()
	const style = {
		position: 'relative',
		boxSizing: 'border-box',
		paddingTop: '100%',
		overflow: 'hidden',
		width: '100%',
	}

	// Filter down to just the smaller sizes for srcset
	const smallSizes = {}
	const allow = [ 'thumbnail', 'medium', 'large' ]
	for ( let key in sizes ) {
		if ( allow.includes( key ) ) {
			smallSizes[key] = sizes[key]
		}
	}

	return (
		<div className="fl-asst-attachment-grid-item" style={ style }>
			<div style={ {
				position: 'absolute',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
				background: 'var(--fluid-primary-background)',
				color: 'var(--fluid-primary-color)',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
			} }>
				{ ( 'image' === type || 'pdf' === item.subtype ) && (
					<img
						src={ thumbnail }
						srcSet={ getSrcSet( smallSizes ) }
						alt={ alt }
						title={ title }
						loading="lazy"
						style={ {
							height: '100%',
							width: '100%',
							objectPosition: 'pdf' === item.subtype ? 'top center' : null
						} }
						height={ 157.5 }
						width={ 157.5 }
					/>
				)}
				{ 'video' === type && <Image.Video /> }
				{ 'audio' === type && <Image.Audio /> }

				{ 'application' === type && 'pdf' !== item.subtype && (
					<Image.Doc />
				)}
				<div className="fl-asst-attachment-item-badge">
					<span>{item.subtype}</span>
				</div>
				{ itemExtras && (
					<div
						className="fl-asst-list-item-extras"
						onClick={ stopProp }
					>{itemExtras}</div>
				) }
			</div>
		</div>
	)
}

export default Attachments
