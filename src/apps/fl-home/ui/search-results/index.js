import React from 'react'
import { List, Layout } from 'assistant/ui'
import { getListSectionConfig, getListItemConfig, getRequestConfig } from '../../config'

const Results = ({
    isLoading = false,
    items,
    keyword,
    baseURL
}) => {

    if ( isLoading ) {
        return (
            <List.Loading />
        )
    }

    const { config } = getRequestConfig( { keyword } )

    return (
        <Layout.Box padY={false}>
            <List
                items={items}
                getSectionProps={ ( section, defaultProps ) => {
                    return getListSectionConfig( {
                        section,
                        defaultProps,
                        keyword,
                        baseURL,
                    } )
                } }
                getItemProps={ ( item, defaultProps ) => {
                    return getListItemConfig( {
                        item,
                        defaultProps,
                        config,
                        baseURL,
                    } )
                } }
            />
        </Layout.Box>
    )
}

export default Results
