import React, { Fragment, useState } from 'react'
import { PostList } from 'components/post-list'
import { TabBar } from 'components/tab-bar'

export const NavigateTab = props => {
    const [ currentTab, setCurrentTab ] = useState( 'post' )
    const { types } = FLAssistantInitialData.site
    const tabs = []

    Object.keys( types ).map( ( key ) => tabs.push( {
        label: types[ key ],
        onClick: () => setCurrentTab( key ),
        isSelected: key === currentTab,
    } ) )

	tabs.push( {
	   label: 'Favorites',
	   onClick: () => setCurrentTab( 'favorites' ),
	   isSelected: 'favorites' === currentTab,
   } )

    return (
        <Fragment>
            <TabBar tabs={ tabs } />
            <PostList type={ currentTab } />
        </Fragment>
    )
}
