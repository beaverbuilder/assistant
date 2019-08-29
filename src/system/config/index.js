import { getSystemActions } from 'store'

const { registerSection } = getSystemActions()

registerSection( 'my-first-section', {
	label: 'My First Section',
	screen: 'post',
	render: () => {},
})

registerSection( 'my-second-section', {
	label: 'My Second Section',
	screen: ['post', 'page'],
	render: () => {},
})
