import React from 'react'
import { List, Layout } from 'assistant/ui'

const Results = ({ ...rest }) => {
    return (
        <Layout.Box padY={false}>
            <List {...rest} />
        </Layout.Box>
    )
}

export default Results
