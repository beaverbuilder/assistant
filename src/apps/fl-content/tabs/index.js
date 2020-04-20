import React, { useContext } from 'react'
import { __ } from '@wordpress/i18n'
import { List, App, Page, Layout, Filter } from 'assistant/ui'
import { useAppState, getAppActions, getSystemSelectors, getSystemConfig } from 'assistant/data'
import { addFilter } from 'assistant/hooks'
import { defaultState } from '../'

export const SummaryTab = () => {
	const { handle } = useContext( App.Context )
	const { getCount } = getSystemSelectors()
	const { contentTypes } = getSystemConfig()
	return (
		<>
			<Page.Section>

				<div style={ {
					display: 'grid',
					gridTemplateColumns: 'repeat(3, 1fr)',
					gap: 5
				} }>
					{ Object.entries( contentTypes ).map( ( [ key, item ], i ) => {
						const { labels } = item
						return (
							<div key={ i } style={ {
								display: 'flex',
								flexDirection: 'column',
								background: 'var(--fluid-primary-background)',
								color: 'var(--fluid-primary-color)',
								borderRadius: 'var(--fluid-sm-space)',
								padding: 'var(--fluid-med-space)'
							} }>
								{labels.plural}
								<span style={ { fontSize: 24, marginTop: 5, lineHeight: 1 } }>{getCount( `content/${key}` )}</span>
							</div>
						)
					} )}
				</div>

			</Page.Section>

			<Page.Section label={ __( 'Latest Posts' ) } padX={ false }>
				<List.Posts
					query={ {
						post_type: 'post',
						posts_per_page: 5
					} }
					paginate={ false }
					getItemProps={ ( item, defaultProps ) => {
						if ( item.id ) {
							return {
								...defaultProps,
								description: null,
								thumbnailSize: 'sm',
								to: {
									pathname: `/${handle}/post/${item.id}`,
									state: { item }
								},
							}
						}
						return defaultProps
					} }
				/>
			</Page.Section>
		</>
	)
}

export const PostTypeTab = ( { type = 'post' } ) => {
	const { handle } = useContext( App.Context )
	const { query, listStyle } = useAppState( 'fl-content' )
	const { setQuery, setListStyle } = getAppActions( 'fl-content' )

	const defaultQuery = defaultState.query

	const style = {
		maxHeight: '100%',
		minHeight: 0,
		flex: '1 1 auto',
	}

	const BeforeContent = () => {

		const sorts = {
			title: __( 'Title' ),
			author: __( 'Author' ),
			ID: __( 'Post ID' ),
			date: __( 'Date Created' ),
			modified: __( 'Date Modified' )
		}

		const statuses = {
			any: __( 'Any' ),
			publish: __( 'Published' ),
			draft: __( 'Drafted' ),
			pending: __( 'Pending' ),
			future: __( 'Scheduled' ),
			private: __( 'Private' ),
			trash: __( 'Trashed' ),
		}

		const orders = {
			ASC: __( 'Ascending' ),
			DESC: __( 'Descending' )
		}

		const displays = {
			'': __( 'List' ),
			'thumb': __( 'Post Thumbnails' )
		}

		return (
			<>
				<Filter>
					<Filter.RadioGroupItem
						title={ __( 'Status' ) }
						items={ statuses }
						value={ query.post_status }
						defaultValue={ defaultQuery.post_status }
						onChange={ value => setQuery( { ...query, post_status: value } ) }
					/>
					<Filter.LabelsItem
						value={ query.label }
						defaultValue={ defaultQuery.label }
						onChange={ value => setQuery( { ...query, label: value } ) }
					/>
					<Filter.RadioGroupItem
						title={ __( 'Display As' ) }
						items={ displays }
						value={ listStyle }
						defaultValue={ defaultState.listStyle }
						onChange={ value => setListStyle( value ) }
					/>
					<Filter.RadioGroupItem
						title={ __( 'Sort By' ) }
						items={ sorts }
						value={ query.orderby }
						defaultValue={ defaultQuery.orderby }
						onChange={ value => setQuery( { ...query, orderby: value } ) }
					/>
					<Filter.RadioGroupItem
						title={ __( 'Order' ) }
						items={ orders }
						value={ query.order }
						defaultValue={ defaultState.query.order }
						onChange={ value => setQuery( { ...query, order: value } ) }
					/>
					<Filter.Button onClick={ () => setQuery( defaultQuery ) }>{__( 'Reset Filter' )}</Filter.Button>
				</Filter>

				<List.InlineCreate
					postType={ type }
					onPostCreated={ () => setQuery( {
						...defaultState.query,
						order: 'DESC',
						orderby: 'ID',
						key: new Date().getTime()
					} ) }
				/>
			</>
		)
	}

	return (
		<Layout.Box outset={ true } padY={ false } style={ style }>
			<List.Posts
				query={ { ...query, post_type: type } }
				listStyle={ listStyle }
				getItemProps={ ( item, defaultProps ) => {
					if ( item.id ) {
						return {
							...defaultProps,
							to: {
								pathname: `/${handle}/post/${item.id}`,
								state: { item }
							},
						}
					}
					return defaultProps
				} }
				before={ <BeforeContent /> }
			/>
		</Layout.Box>
	)
}

addFilter( 'list-item-actions', 'fl-assistant', ( actions, { item, listType } ) => {

	if ( 'post' === listType ) {
		const i = actions.findIndex( action => 'edit-post' === action.handle )
		if ( i ) {

			// Replace existing admin edit action
			const action = actions[i]
			delete action.href
			action.isShowing = true
			action.title = __( 'Edit Details' )
			action.to = {
				pathname: `/fl-content/post/${item.id}`,
				state: { item }
			}
		}
	}

	return actions
} )
