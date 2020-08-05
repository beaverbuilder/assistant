import React from 'react'
import { Layout } from 'assistant/ui'
import ItemContext from '../context'

export default () => {
	return (
		<Layout.AspectBox ratio='16:9'>
			<HeroImage />
		</Layout.AspectBox>
	)
}

const HeroImage = () => {
	const { item } = ItemContext.use()
	const { type, data, media } = item

	if ( !! media.length ) {
		return <img src={ media[0].url } />
	}
	if ( 'svg' === type ) {
		return (
			<div
				dangerouslySetInnerHTML={{
					__html: data.xml
				}}
				className="fl-asst-item-svg-container"
			/>
		)
	}
	return null
}
