import React from 'react'

const prepare = items => {
    if ( ! Array.isArray( items ) ) {
        return Object.values( items )
    }
    return items
}

const defaultMapProps = ( props, key ) => {
    return {
        key,
        children: 'test children'
    }
}

const Iterator = ({
    items,
    mapProps = defaultMapProps,
    tag: Tag = 'div',
}) => {

    return prepare( items ).map( ( item, i ) => {
        const props = mapProps( item, i )
        return (
            <Tag {...props} />
        )
    })
}

export default Iterator

/*
[string, string, string]
[{}, {}, {}]
{ item: {}, item: {}, item: {} }

<Iterator
    items={ data }
    sortItems={ item => 0 }
/>

<Wrapper>
    <Before>
        <Item />
        <Item>
            <SubItem />
        </Item>
    </After>
</Wrapper>
*/
