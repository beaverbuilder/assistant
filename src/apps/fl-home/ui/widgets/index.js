import React from 'react'
import { Layout, Icon, Widget } from 'assistant/ui'
import './style.scss'

const EndCap = () => {
	return (
		<Layout.Row padY={ true }>
			<Icon.Pencil size={ 50 } />
		</Layout.Row>
	)
}

export default props => {
	return (
		<Widget.Layout
			handle='home'
			after={ <li><EndCap /></li> }
			{ ...props }
		/>
	)
}
