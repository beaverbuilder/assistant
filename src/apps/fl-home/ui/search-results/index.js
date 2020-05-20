import React from 'react'
import { List, Layout } from 'assistant/ui'

const Results = ({ isLoading = false, ...rest }) => {

    if ( isLoading ) {
        return (
            <List.Loading />
        )
    }
    
    return (
        <Layout.Box padY={false}>
            <List {...rest} />
        </Layout.Box>
    )
}

export default Results
