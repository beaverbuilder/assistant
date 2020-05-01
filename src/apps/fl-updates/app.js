import React, { useEffect } from 'react'
import { getWpRest } from 'assistant/utils/wordpress'
import { __, sprintf } from '@wordpress/i18n'
import { App, Page, Button, List, Filter, Layout } from 'assistant/ui'
import {
	useAppState,
	getAppActions,
	getUpdaterStore,
	getUpdaterActions,
} from 'assistant/data'
import { defaultState } from './'
import useUpdates from './use-updates'
import AppIcon from './icon'

export default props => (
	<App.Config
		pages={ {
			default: UpdatesMain,
			'plugin/:id': Page.Plugin,
			'theme/:id': Page.Theme
		} }
		{ ...props }
	/>
)

const UpdatesMain = ( { handle } ) => {
	const updater = getUpdaterStore()
	const { setUpdateQueueItems } = getUpdaterActions()
	const { updatingAll, updateType, listStyle } = useAppState( handle )
	const { setUpdatingAll, setUpdateType, setListStyle } = getAppActions( handle )
	const { getContent } = getWpRest()
	const { plugins, themes, total, hasUpdates } = useUpdates()

	const updateAll = () => {
		setUpdatingAll( true )
		getContent( 'updates' ).then( response => {
			const { items } = response.data
			setUpdateQueueItems( items )
		} ).catch( error => {
			console.log( error ) // eslint-disable-line no-console
			setUpdatingAll( false )
			alert( __( 'Something went wrong. Please try again.' ) )
		} )
	}

	const maybeSetUpdatingAll = () => {
		const { updateQueue } = updater.getState()
		if ( ! Object.values( updateQueue ).length ) {
			setUpdatingAll( false )
		}
	}

	useEffect( () => {
		maybeSetUpdatingAll()
		const unsubscribe = updater.subscribe( maybeSetUpdatingAll )
		return () => unsubscribe()
	}, [] )

	const HeaderActions = () => {

		if ( ! hasUpdates ) {
			return null
		}

		if ( updatingAll ) {
			return (
				<Button.Loading>
					{ __( 'Updating' ) }
				</Button.Loading>
			)
		}
		return (
			<Button onClick={ updateAll }>
				{ __( 'Update All' ) }
			</Button>
		)
	}

	const UpdatesFilter = () => {

		const types = {
			'all': sprintf( 'All (%s)', total ),
			plugins: sprintf( 'Plugin (%s)', plugins ),
			themes: sprintf( 'Theme (%s)', themes ),
		}

		const listStyles = {
			card: __( 'Cards' ),
			list: __( 'Compact' )
		}

		const resetFilter = () => {
			setUpdateType( defaultState.updateType )
			setListStyle( defaultState.listStyle )
		}

		return (
			<Filter>
				<Filter.RadioGroupItem
					title={ __( 'Type' ) }
					items={ types }
					value={ updateType }
					defaultValue={ defaultState.updateType }
					onChange={ value => setUpdateType( value ) }
				/>
				<Filter.RadioGroupItem
					title={ __( 'Display As' ) }
					items={ listStyles }
					value={ listStyle }
					defaultValue={ defaultState.listStyle }
					onChange={ value => setListStyle( value ) }
				/>
				<Filter.Button onClick={ resetFilter }>{__( 'Reset Filter' )}</Filter.Button>
			</Filter>
		)
	}

	return (
		<Page
			title={ __( 'Updates' ) }
			icon={ <AppIcon context="sidebar" /> }
			shouldShowBackButton={ false }
			actions={ <HeaderActions /> }
			padY={ false }
			shouldScroll={ false }
		>

			{ ! hasUpdates && (
				<Layout.Box>{__( 'You have no updates.' )}</Layout.Box>
			)}

			{ hasUpdates && (
				<List.Updates
					updateType={ updateType }
					getItemProps={ ( item, defaultProps ) => {
						return {
							...defaultProps,
							to: {
								pathname: `/${handle}/${item.type}/${item.id}`,
								state: { item }
							},
						}
					} }
					before={ <UpdatesFilter /> }
					listStyle={ listStyle }
				/>
			)}
		</Page>
	)
}
