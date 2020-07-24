import React, { useEffect, useState } from 'react'
import { useHistory, useParams, Route } from 'react-router-dom'
import { __ } from '@wordpress/i18n'
import { Layout } from 'assistant/ui'
import cloud from 'assistant/cloud'

import Members from './members'
import ItemsFilter from './filter'
import ItemsGrid from './grid'
import { getFilteredItems } from './utils'

export default ( { library } ) => {
	const [ items, setItems ] = cloud.libraries.useItems( library.id )
	const [ filter, setFilter ] = useState( null )
	const { owner_type, owner_id } = library

	if ( ! items ) {
		return null
	}

	return (
		<>
			<Layout.Box
				style={ {
					textAlign: 'center',
					paddingTop: 0
				} }
			>
				<Layout.Headline>
					{ library.name }
				</Layout.Headline>
				{ library.description &&
					<div style={ { marginTop: 'var(--fluid-sm-space)' } }>
						{ library.description }
					</div>
				}
			</Layout.Box>

			{ 'team' === owner_type &&
				<Members teamId={ owner_id } />
			}

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
