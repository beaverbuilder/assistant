import classname from 'classnames'
import Box from './box'
import './style.scss'

const Layout = () => {}

Layout.Box = Box
Layout.Box.displayName = 'Layout.Box'

// Headline
Layout.Headline = ({ className, children, ...rest }) => {
    const classes = classname( 'fluid-headline', className )
    return (
        <div className={classes} role="heading" aria-level="2" {...rest}>{children}</div>
    )
}
Layout.Headline.displayName = 'Layout.Headline'

export default Layout
