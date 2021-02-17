import React from 'react'
import { Page, Layout } from 'ui'

const Loading = () => {
	return (
		<Page
			toolbar={ false }
			contentWrapStyle={ {
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'center'
			} }
		>
			<div style={ {
				width: 90,
				height: 90,
				borderRadius: 45,
				background: 'var(--fluid-box-background)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			} } >
				<Layout.Loading style={ { flex: '0 0 auto' } } />
			</div>
		</Page>
	)
}

export default Loading
