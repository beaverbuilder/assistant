import React from 'react'
import * as Layout from '../../layout'
import * as List from '../../list'

export default () => {

    const items = {
        one: { label: "One" },
        two: { label: "Two" },
        three: { label: "Three" }
    }

    const arrayItems = [
        { label: "One" },
        { label: "Two" },
        { label: "Three" }
    ]

    return (
        <Layout.ContentBoundary>
            <h1>Lists</h1>
            <p>Lists are how you list things...</p>

            <List.Iterator
                items={items}
            />

            <List.Iterator
                items={arrayItems}
            />
        </Layout.ContentBoundary>
    )
}
