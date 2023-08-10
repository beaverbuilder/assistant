import React from 'react'
import { __ } from '@wordpress/i18n'
import { List, Page, Layout } from 'assistant/ui'
import { useAppState, getAppActions, getSystemSelectors, getSystemConfig } from 'assistant/data'
import { defaultState } from '../'

export const SummaryTab = () => {
	const handle = 'fl-code'
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
				<List.Code
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
									pathname: `/${handle}/fl_css/${item.id}`,
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
	const handle = 'fl-code'
	const { query, listStyle } = useAppState( handle )
	const { setQuery, setListStyle } = getAppActions( handle )

	const defaultQuery = defaultState.query

	const style = {
		maxHeight: '100%',
		minHeight: 0,
		flex: '1 1 auto',
	}

	const BeforeContent = () => {

		return (
			<>
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
			<List.Code
				query={ { ...query, post_type: type } }
				listStyle={ listStyle }
				getItemProps={ ( item, defaultProps ) => {
					if ( item.id ) {
						return {
							...defaultProps,
							to: {
								pathname: `/${handle}/fl_css/${item.id}`,
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
