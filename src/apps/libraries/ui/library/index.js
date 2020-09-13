import React from 'react'
import { useLocation, Switch, Route } from 'react-router-dom'
import { __ } from '@wordpress/i18n'
import { Libraries } from '@beaverbuilder/cloud-ui'
import { Page } from 'assistant/ui'

import LibraryActions from './actions'
import LibraryItems from './items'
import LibraryItem from '../library-item'
import LibrarySettings from './settings'

export default () => {
	const { pathname } = useLocation()
	return (
		<Libraries.LibraryDetail>
			<div
				style={ {
					visibility: pathname.includes( '/items/' ) ? 'hidden' : '',
					width: '100%',
					flex: '1 1 auto',
					display: 'flex',
					position: 'absolute',
					top: 0,
					bottom: 0
				} }
			>
				<Page
					title={ __( 'Library' ) }
					shouldShowBackButton={ true }
					actions={ <LibraryActions /> }
					padX={ false }
					padY={ false }
				>
					<Switch>
						<Route path='/libraries/:id/settings' component={ LibrarySettings } />
						<Route path='/libraries/:id' component={ LibraryItems } />
					</Switch>
				</Page>
			</div>
			<Switch>
				<Route path='/libraries/:id/item/:itemId' component={ LibraryItem } />
			</Switch>
		</Libraries.LibraryDetail>
	)
}
