import React from 'react'
import { __ } from '@wordpress/i18n'
import { getSystemConfig, useSystemState } from 'assistant/data'
import './style.scss'

const Counts = () => {
	const { counts } = useSystemState()
	const config = getSystemConfig()

	const lines = [
		{
			label: config.contentTypes.post.labels.plural,
			count: counts[ 'content/post' ] ? counts[ 'content/post' ] : 0
		},
		{
			label: config.contentTypes.page.labels.plural,
			count: counts[ 'content/page' ] ? counts[ 'content/page' ] : 0
		},
		{
			label: __( 'Comments' ),
			count: counts[ 'comment/total' ] ? counts[ 'comment/total' ] : 0
		},
		{
			label: __( 'Updates' ),
			count: counts[ 'update/total' ] ? counts[ 'update/total' ] : 0
		},
	]

	return (
		<div className="fl-asst-count-grid">
			{ lines.map( ( { label, count } ) => (
				<>
					<span className="fl-asst-count-metric">{count}</span>
					<span className="fl-asst-count-label">{label}</span>
				</>
			) ) }
		</div>
	)
}

export default Counts
