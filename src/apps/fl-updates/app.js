import React, { useContext, useEffect } from 'react'
import { getWpRest } from 'assistant/utils/wordpress'
import { __, sprintf } from '@wordpress/i18n'
import { App, Page, Button, List, Nav, Filter } from 'assistant/ui'
import {
	useSystemState,
	useAppState,
	getAppActions,
	getUpdaterStore,
	getUpdaterActions,
} from 'assistant/data'
import { defaultState } from './'
import AppIcon from './icon'

export const UpdatesApp = ( { match } ) => (
	<Nav.Switch>
		<Nav.Route exact path={ `${match.url}/` } component={ UpdatesMain }/>
		<Nav.Route path={ `${match.url}/plugin/:id` } component={ Page.Plugin }/>
		<Nav.Route path={ `${match.url}/theme/:id` } component={ Page.Theme }/>
	</Nav.Switch>
)

const UpdatesMain = () => {
	const updater = getUpdaterStore()
	const { setUpdateQueueItems } = getUpdaterActions()
	const { updatingAll, updateType, listStyle } = useAppState( 'fl-updates' )
	const { setUpdatingAll, setUpdateType, setListStyle } = getAppActions( 'fl-updates' )
	const { handle } = useContext( App.Context )
	const { getContent } = getWpRest()
	const { counts } = useSystemState()

	const totalUpdates = counts['update/plugins'] + counts['update/themes']
	const hasUpdates = 0 !== totalUpdates

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
			'all': __( 'All' ),
			plugins: sprintf( 'Plugin (%s)', counts['update/plugins'] ),
			themes: sprintf( 'Theme (%s)', counts['update/themes'] ),
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
				<Page.Empty>{__( 'You have no updates.' )}</Page.Empty>
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
