import React from 'react'
import { __ } from '@wordpress/i18n'
import { Icon } from 'assistant/ui'
import { getCardsActions } from '../data'
import Shortcuts from './shortcuts'
import Query from './query'
import TileGrid from './tile-grid'
import Apps from './apps'

const { registerCardType } = getCardsActions()

const registerDefaultCardTypes = () => {

	registerCardType( 'fl-query', {
		label: __( 'Query' ),
		render: Query,
		edit: Query.Edit,
		contentProps: {
			style: {
				padding: 0
			}
		}
	} )

	registerCardType( 'fl-shortcuts', {
		label: __( 'Shortcuts' ),
		icon: Icon.Link,
		render: Shortcuts,
		edit: Shortcuts.Edit,
		contentProps: {
			style: {
				padding: 'var(--fluid-sm-space)'
			}
		}
	} )

	registerCardType( 'fl-apps', {
		label: __( 'Apps' ),
		icon: Icon.Apps,
		render: Apps,
		edit: Apps.Edit,
		contentProps: {
			style: {
				padding: 'var(--fluid-med-space)'
			}
		}
	} )

	registerCardType( 'fl-labels', {
		label: __( 'Labels' ),
		render: () => <div>Render Label List</div>,
		edit: () => <div>Edit</div>,
	} )

	registerCardType( 'fl-tile-grid', {
		label: __( 'Tile Grid' ),
		render: TileGrid,
		edit: TileGrid.Edit,
		contentProps: {
			style: {
				padding: 0,
				background: 'transparent',
				boxShadow: 'none',
			}
		}
	} )

}

registerDefaultCardTypes()
