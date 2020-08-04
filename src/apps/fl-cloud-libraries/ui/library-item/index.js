import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { __ } from '@wordpress/i18n'
import { Button, Form, Icon, Layout, Page } from 'assistant/ui'
import cloud from 'assistant/cloud'

import ItemHero from './hero'
import ItemForm from './form'

export default () => {
	const history = useHistory()
	const { itemId } = useParams()
	const [ item, setItem ] = cloud.libraries.useItem( itemId )

	if ( ! item ) {
		return <Page.Loading />
	}

	const deleteItem = () => {
		if ( confirm( __( 'Do you really want to delete this item?' ) ) ) {
			cloud.libraries.deleteItem( item.id )
			history.goBack()
		}
	}

	return (
		<Page
			title={ __( 'Library Item' ) }
			shouldShowBackButton={ true }
			padX={ false }
			hero={ <ItemHero { ...item } /> }
		>
			<Layout.Box
				padY={ false }
				style={ {
					flexDirection: 'row',
					alignItems: 'center',
					paddingTop: 'var(--fluid-sm-space)'
				} }
			>
				<Layout.Headline style={ { width: '100%' } }>
					{ item.name }
				</Layout.Headline>
				<Button
					style={ { marginLeft: '10px' } }
					status='destructive'
					onClick={ deleteItem }
				>
					<Icon.Trash />
				</Button>
			</Layout.Box>
			<ItemForm
				item={ item }
				setItem={ setItem }
			/>
		</Page>
	)
}
