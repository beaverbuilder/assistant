import React from 'react'
import { Layout, Icon, Widget } from 'assistant/ui'

import './style.scss'

const EndCap = () => {
	return (
		<Layout.Row padY={ true } className="fl-asst-widgets-endcap">
			<Icon.PencilOutline size={ 26 } />
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
