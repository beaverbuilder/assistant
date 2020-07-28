import React, { useEffect, useState } from 'react'
import { __ } from '@wordpress/i18n'
import { Layout } from 'assistant/ui'
import { useAppState } from 'assistant/data'

import ItemsHeader from './header'
import ItemsFilter from './filter'
import ItemsGrid from './grid'
import ItemsUpload from '../upload'
import LibraryContext from '../context'
import { getFilteredItems } from './utils'
import './style.scss'

export default () => {
	const { itemsFilter } = useAppState( 'fl-cloud-libraries', 'itemsFilter' )
	const { items, showUpload, setShowUpload, setUploadTab, uploader } = LibraryContext.use()
	const { handleDrop } = uploader

	useEffect( () => {
		if ( items && ! items.length && ! itemsFilter ) {
			setShowUpload( true )
		}
	}, [ items ] )

	const onDrop = ( files ) => {
		setUploadTab( 'media' )
		setShowUpload( true )
		handleDrop( files )
	}

	return (
		<Layout.DropArea onDrop={ onDrop }>

			{ items && !! items.length && (
				<ItemsFilter />
			)}

			<ItemsHeader />

			{ showUpload && <ItemsUpload /> }

			{ items && !! items.length &&
				<>
					<ItemsGrid categories={ getFilteredItems( itemsFilter, items ) } />
				</>
			}

			{ items && ! items.length && ! showUpload &&
				<Layout.Box style={ { textAlign: 'center' } }>
					{ __( 'This library doesn\'t have any items yet.' ) }
				</Layout.Box>
			}
		</Layout.DropArea>
	)
}
