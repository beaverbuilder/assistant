import classname from 'classnames'
import Box from './box'
import Row from './row'
import './style.scss'

const Layout = () => {}

Layout.Box = Box
Layout.Box.displayName = 'Layout.Box'

Layout.Row = Row
Layout.Row.displayName = 'Layout.Row'

// Headline
Layout.Headline = ( { className, children, ...rest } ) => {
	const classes = classname( 'fluid-headline', className )
	return (
		<div className={ classes } role="heading" aria-level="2" { ...rest }>{children}</div>
	)
}
Layout.Headline.displayName = 'Layout.Headline'

export default Layout
