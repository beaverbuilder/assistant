import React from 'react'
import { Layout, Icon, Widget } from 'assistant/ui'
import Welcome from './welcome'
import './style.scss'

const Cap = () => {
	return (
		<Layout.Row padY={ true }>
			<Icon.Pencil size={ 50 } />
		</Layout.Row>
	)
}
const Widgets = () => {
	return (
		<Widget.Layout
			handle='home'
			before={ <li><Welcome /></li> }
			after={ <li><Cap /></li> }
		/>
	)
}

export default Widgets
