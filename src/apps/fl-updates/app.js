import React, { useEffect, useState, useContext } from 'fl-react'
import { getPagedContent } from 'assistant/utils/wordpress'
import { Page, List, App, Nav } from 'assistant/ui'

export const UpdatesApp = ( { match } ) => (
	<Nav.Switch>
		<Nav.Route exact path={`${match.url}/`} component={UpdatesMain} />
		<Nav.Route path={`${match.url}/update`} component={Page.Update} />
	</Nav.Switch>
)

const UpdatesMain = () => {

	return (
		<Page shouldPadSides={false}>
			<UpdatesTab />
		</Page>
	)
}

const UpdatesTab = () => {
	const [ updates, setUpdates ] = useState( [] )
	const { handle } = useContext( App.Context )
	const offset = updates.length
	const hasUpdates = 0 < updates.length
	const query = {
		updateType: 'all',
	}

	useEffect( () => {
		getPagedContent( 'updates', query, offset, ( data ) => {
			setUpdates( updates.concat( data ) )
		} )
	}, [] )

	return (
		<>
			{ ! hasUpdates && <List.Loading /> }
			{ hasUpdates &&
			<List
				items={updates}
				isListSection={ item => 'undefined' !== typeof item.items }
				getItemProps={ ( item, defaultProps, isSection ) => {

					if ( isSection ) {
						return {
							...defaultProps,
							label: item.label
						}
					}

					return {
						...defaultProps,
						label: item.title,
						description: item.meta,
						thumbnail: item.thumbnail,
						to: {
							pathname: `/${handle}/update`,
							state: item
						}
					}
				}}
			/> }
		</>
	)
}
