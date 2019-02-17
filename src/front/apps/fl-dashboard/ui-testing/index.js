import React, { useContext } from 'react'
import { Widget, TagGroup, Tag, UIContext } from 'components'
import { useAppFrame } from 'system'

export const AppFrameTestingWidget = () => {
	const { setAppFrameSize } = useAppFrame()
	return (
		<Widget title="Frame Testing">
			<TagGroup title="Sizes">
				<Tag onClick={ () => setAppFrameSize( 'normal' ) }>Normal</Tag>
				<Tag onClick={ () => setAppFrameSize( 'wide' ) }>Wide</Tag>
				<Tag onClick={ () => setAppFrameSize( 'full' ) }>Fullscreen</Tag>
			</TagGroup>
		</Widget>
	)
}
