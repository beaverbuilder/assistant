import React from 'react'
import { Icon, Button } from 'ui'


export const Message = ( {
	status,
	icon: Icon,
	children,

	...rest
} ) => {


	return (
		<Button status={ status }> <Icon /> &nbsp;{' ' + children}</Button>
	)
}


