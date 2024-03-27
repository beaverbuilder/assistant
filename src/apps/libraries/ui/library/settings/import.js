import React, { useEffect, useState } from 'react'
import { __, sprintf } from '@wordpress/i18n'
import { Libraries } from '@beaverbuilder/cloud-ui'
import { Button } from 'assistant/ui'
import { getWpRest } from 'assistant/utils/wordpress'
import { usePostMediaImport } from 'ui/library/use-post-media-import'
import cloud from 'assistant/cloud'

export default () => {
	const { items } = Libraries.LibraryContext.use()
	const [ currentItem, setCurrentItem ] = useState( null )
	const [ importComplete, setImportComplete ] = useState( false )
	const importPostMedia = usePostMediaImport()

	useEffect( () => {
		if ( null !== currentItem ) {
			importCurrentItem()
		}
	}, [ currentItem ] )

	const importCurrentItem = () => {
		const item = items[ currentItem ]
		const api = getWpRest().libraries()

		if ( 'color' === item.type || 'theme_settings' === item.type ) {
			importNextItem()
		} else if ( 'post' === item.type ) {

			cloud.libraries.getItem( item.id ).then( itemResponse => {
				api.importPost( itemResponse.data ).then( postResponse => {
					importPostMedia( postResponse.data, itemResponse.data ).then( () => {
						importNextItem()
					} )
				} ).catch( () => {
					importNextItem()
				} )
			} ).catch( () => {
				importNextItem()
			} )

		} else {
			api.importItem( item ).finally( importNextItem )
		}
	}

	const importNextItem = () => {
		const nextItem = null === currentItem ? 0 : currentItem + 1
		if ( ! items[ nextItem ] ) {
			setCurrentItem( null )
			setImportComplete( true )
			return
		}
		setCurrentItem( nextItem )
	}

	if ( null === currentItem && ! importComplete ) {
		return (
			<StartImportButton
				onClick={ () => importNextItem() }
			/>
		)
	}

	return (
		<div style={ { gridColumn: 'span 2' } }>
			<p>
				{ __( 'Import in progress. Navigating away from this view will stop the import process!' ) }
			</p>
			<LoadingBar
				progress={ null === currentItem ? 100 : ( currentItem / items.length ) * 100 }
			/>
			<p style={ {
				fontStyle: 'italic',
				fontSize: '12px',
				marginTop: 'var(--fluid-sm-space)',
				whiteSpace: 'nowrap',
				overflow: 'hidden',
				textOverflow: 'ellipsis'
			} }>
				{ null !== currentItem &&
					sprintf( __( 'Importing %s' ), items[ currentItem ].name )
				}
				{ null === currentItem &&
					__( 'Import Complete!' )
				}
			</p>
		</div>
	)
}

const StartImportButton = ( { onClick } ) => {
	return (
		<>
			<Button onClick={ onClick } title={ __( 'Import all items in this library into your site.' ) }>
				{ __( 'Import All Library Items' ) }
			</Button>
		</>
	)
}

const LoadingBar = ( { progress } ) => {
	return (
		<div
			style={ {
				background: 'var(--fluid-transparent-10)',
				borderRadius: 'var(--fluid-radius)',
				height: '6px'
			} }
		>
			<div
				style={ {
					background: 'var(--fluid-transparent-4)',
					borderRadius: 'var(--fluid-radius)',
					height: '6px',
					width: `${ progress }%`
				} }
			/>
		</div>
	)
}
