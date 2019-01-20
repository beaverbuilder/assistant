import React, { Fragment, useState } from 'react'
import { ScreenHeader } from 'components/panel-parts'
import { PostList } from 'components/post-list'
import { TabBar } from 'components/tab-bar'

export const NavigateTab = props => {
    const [ currentTab, setCurrentTab ] = useState( 'page' )
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

            <ScreenHeader>
                <div className="fl-asst-screen-title">Find</div>
            </ScreenHeader>

            <TabBar tabs={ tabs } />
            <PostList type={ currentTab } />
        </Fragment>
    )
}
