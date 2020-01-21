import { useContext } from 'react'
import { __ } from '@wordpress/i18n'
import { List, App, Page, Layout, Filter } from 'assistant/ui'
import { useAppState, getAppActions, useSystemState, getSystemConfig } from 'assistant/data'
import { defaultQuery } from '../'

export const SummaryTab = () => {
	const { handle } = useContext( App.Context )
	const { counts } = useSystemState()
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
								<span style={ { fontSize: 24, marginTop: 5, lineHeight: 1 } }>{counts[`content/${key}`]}</span>
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
	const { query } = useAppState( 'fl-content' )
	const { setQuery } = getAppActions( 'fl-content' )

	const style = {
		maxHeight: '100%',
		minHeight: 0,
		flex: '1 1 auto',
	}

	const PostFilter = () => {

		const sorts = {
	        title: __('Title'),
	        author: __('Author'),
	        ID: __('Post ID'),
	        date: __('Date Created'),
	        modified: __('Date Modified')
	    }

		return (
			<Filter>
				<Filter.RadioGroupItem
		            title={ __('Sort By' ) }
		            items={sorts}
					value={query.orderby}
					defaultValue={defaultQuery.orderby}
					onChange={ value => setQuery({ ...query, orderby: value }) }
		        />
				<Filter.Button onClick={ () => setQuery( defaultQuery ) }>{__( 'Reset Filter' )}</Filter.Button>
			</Filter>
		)
	}

	return (
		<Layout.Box outset={ true } padY={ false } style={ style }>
			<List.Posts
				query={ { ...query, post_type: type } }
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
				before={ <PostFilter /> }
			/>
		</Layout.Box>
	)
}
