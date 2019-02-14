import React, { useContext } from 'react'
import { Widget, TagGroup, Tag, UIContext } from 'components'

export const AppFrameTestingWidget = () => {
    const { setAppFrameSize } = useContext( UIContext )
    return (
        <Widget title="Frame Testing">
            <TagGroup title="Sizes">
                <Tag onClick={ () => setAppFrameSize('normal') }>Normal</Tag>
                <Tag onClick={ () => setAppFrameSize('wide') }>Wide</Tag>
                <Tag onClick={ () => setAppFrameSize('full') }>Fullscreen</Tag>
            </TagGroup>
        </Widget>
    )
}
