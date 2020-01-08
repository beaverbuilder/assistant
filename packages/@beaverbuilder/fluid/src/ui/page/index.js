import { useContext, useEffect } from 'react'
import classname from 'classnames'
import Nav from '../nav'
import Section from './section'
import Error from '../error'
import Layout from '../layout'
import './style.scss'

const focusFirstElement = () => {

}

const Page = ({
    children,
    className,
    hero,
    title,
    toolbar,
    actions,
    header,
    footer,
    onLoad = focusFirstElement,

    // Passed to Layout.Box
    padX = true,
    padY = true,
    contentWrapStyle = null,

    ...rest
}) => {
    const { isRoot } = useContext( Nav.Context )
    const classes = classname( 'fluid-page', className )

    // Handle initial loading, like focusing.
    useEffect( onLoad, [] )

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
                { isString && <img src={children} style={{ width: '100%' }} /> }
                { !isString && children }
            </div>
        )
    }

    const wrapStyle = {
        flex: '1 1 auto',
        position: 'relative',
        minHeight: 0,
        maxHeight: '100%',
        display: 'flex',
        flexDirection: 'column'
    }

    const contentBoxStyle = {
        flexGrow: 1,
        flexShrink: 0,
        ...contentWrapStyle,
    }

    return (
        <div className="fluid-page-wrap" style={wrapStyle}>
            <div className={classes} style={style} {...rest}>
                <Hero>{hero}</Hero>

                <div className="fluid-page-content">
                    <div className="fluid-sticky-element">
                        { toolbar !== false  && (
                            <div className="fluid-toolbar">
                                { !isRoot  && <Nav.BackButton /> }
                                { title && <div className="fluid-page-toolbar-content">
                                    <span  role="heading" aria-level="1" style={{ flex: '1 1 auto' }}>{title}</span>
                                </div> }
                                { actions && <span className="fluid-page-actions">{actions}</span> }
                            </div>
                        )}
                        { header && <div className="fluid-toolbar fluid-page-header">{header}</div> }
                    </div>
                    <Layout.Box padX={padX} padY={padY} style={contentBoxStyle}>
                        <Error.Boundary>{children}</Error.Boundary>
                    </Layout.Box>
                </div>
            </div>
            { footer && <div className="fluid-page-footer">{footer}</div> }
        </div>
    )
}

Page.Section = Section
Page.Section.displayName = 'Page.Section'

export default Page
