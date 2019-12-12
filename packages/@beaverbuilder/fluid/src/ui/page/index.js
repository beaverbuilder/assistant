import { useContext } from 'react'
import classname from 'classnames'
import Nav from '../nav'
import Section from './section'
import Error from '../error'
import './style.scss'

const Page = ({
    children,
    className,
    hero,
    title,
    actions,
    footer,
    ...rest
}) => {
    const { isRoot } = useContext( Nav.Context )
    const classes = classname( 'fluid-page', className )

    const style = {
        overflowX: 'hidden',
        overflowY: 'scroll',
        perspective : 1,
        perspectiveOrigin: '0 0',
    }

    const Hero = ({ children }) => {

        if ( ! children ) return null
        const isString = 'string' === typeof children

        const style = {
            transformOrigin: '0 0',
            transform: 'translateZ(-2px) scale(3)'
        }

        return (
            <div style={style}>
                { isString && <img src={children} /> }
                { !isString && children }
            </div>
        )
    }

    return (
        <div className={classes} style={style} {...rest}>
            <Hero>{hero}</Hero>

            <div className="fluid-page-content">
                <div className="fluid-toolbar fluid-sticky-element">
                    { !isRoot  && <Nav.BackButton /> }
                    { title && <div className="fluid-page-toolbar-content">
                        <span  role="heading" aria-level="1">{title}</span>
                    </div> }
                    {actions}
                </div>
                <div className="fluid-pad">
                    <Error.Boundary>{children}</Error.Boundary>
                </div>
            </div>
            { footer && <div className="fluid-page-footer">
                {footer}
            </div> }
        </div>
    )
}

// Headline
Page.Headline = ({ className, children, ...rest }) => {
    const classes = classname( 'fluid-page-headline', className )
    return (
        <div className={classes} role="heading" aria-level="2" {...rest}>{children}</div>
    )
}
Page.Headline.displayName = 'Page.Headline'

// Section
Page.Section = Section
Page.Section.displayName = 'Page.Section'

export default Page
