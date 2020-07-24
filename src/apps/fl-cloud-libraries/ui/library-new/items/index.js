import React, { useEffect, useState } from 'react'
import { useHistory, useParams, Route } from 'react-router-dom'
import { __ } from '@wordpress/i18n'
import { Layout } from 'assistant/ui'
import cloud from 'assistant/cloud'

import ItemsFilter from './filter'
import ItemsGrid from './grid'
import { getFilteredItems } from './utils'

export default ( { library } ) => {
	const [ items, setItems ] = cloud.libraries.useItems( library.id )
	const [ filter, setFilter ] = useState( null )

	if ( ! items ) {
		return null
	}

	return (
		<>
			{ !! items.length &&
				<>
					<ItemsFilter onChange={ values => setFilter( values ) } />
					<ItemsGrid categories={ getFilteredItems( filter, items ) } />
				</>
			}
			{ ! items.length &&
				<Layout.Box style={ { textAlign: 'center' } }>
					{ __( 'This library doesn\'t have any items yet.' ) }
				</Layout.Box>
			}
		</>
	)
}
