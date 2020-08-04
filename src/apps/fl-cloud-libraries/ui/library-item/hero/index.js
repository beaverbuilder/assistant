import React from 'react'
import { Layout } from 'assistant/ui'

export default ( props ) => {
	return (
		<Layout.AspectBox>
			<HeroImage { ...props } />
		</Layout.AspectBox>
	)
}

const HeroImage = ( { type, data, media } ) => {

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
