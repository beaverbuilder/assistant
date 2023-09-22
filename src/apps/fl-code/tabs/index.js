import React from 'react'
import { __ } from '@wordpress/i18n'
import { List, Page, Layout } from 'assistant/ui'
import { useAppState, getAppActions, getSystemSelectors, getSystemConfig } from 'assistant/data'
import { defaultState } from '../'

export const PostTypeTab = ( { type = 'css' } ) => {
	const handle = 'fl-code'
	const { query, listStyle } = useAppState( handle )
	const { setQuery, setListStyle } = getAppActions( handle )

	const style = {
		maxHeight: '100%',
		minHeight: 0,
		flex: '1 1 auto',
	}

	const BeforeContent = () => {

		return (
			<>
				<List.InlineCreate
					postType={ 'fl_code' }
					codeType={ type }
					onPostCreated={
						() => setQuery( {
							...defaultState.query,
							order: 'DESC',
							orderby: 'ID',
							key: new Date().getTime()
						} )
					}
				/>
			</>
		)
	}

	return (
		<Layout.Box outset={ true } padY={ false } style={ style }>
			<List.Code
				query={ {
					...query,
					post_type: 'fl_code',
					meta_key: 'code_type',
					meta_value: type
				} }
				listStyle={ listStyle }
				getItemProps={ ( item, defaultProps ) => {
					if ( item.id ) {
						return {
							...defaultProps,
							to: {
								pathname: `/${handle}/fl_code/${item.id}`,
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
