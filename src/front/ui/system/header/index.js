import React, { useContext } from 'react'
import { TunnelPlaceholder } from 'react-tunnels'
import { UIContext } from 'components'
import { useAppState, getAppActions } from 'store'
import classname from 'classnames'
import {
    Button
} from 'components'
import './style.scss'

export const AppHeader = () => {
    const { activeAppName: appName, activeApp: app } = useContext( UIContext )
    const { isAppHeaderExpanded } = useAppState( appName )
    const { setIsAppHeaderExpanded } = getAppActions( appName )

    return (
        <div className="fl-asst-app-header">
            <CollapsedContent isExpanded={isAppHeaderExpanded}>{app.label}</CollapsedContent>
            <ExpandedContent isExpanded={isAppHeaderExpanded} />
            <ExpanderButton isExpanded={isAppHeaderExpanded} onClick={ () => setIsAppHeaderExpanded( !isAppHeaderExpanded ) } />
        </div>
    )
}

const CollapsedContent = props => {
    const { children, className, isExpanded } = props
    const { activeAppName: appName } = useContext( UIContext )

    if ( isExpanded ) return null

    const classes = classname({
        'fl-asst-app-header-content': true,
    }, className )

    const merged = {
        ...props,
        className: classes,
    }
    delete merged.isExpanded

    return (
        <TunnelPlaceholder id={`app-header-${appName}`} appName={appName} multiple>
			{ ( { items } ) => {
				if ( 'undefined' !== items && 0 < items.length ) {
                    return (
                        <div {...merged}>
                        { items.map( item => item.children )}
                        </div>
                    )
				}

                // Default to app title
				return (
                    <div {...merged}>
                        <div className="fl-asst-app-title">{children}</div>
                    </div>
                )
			} }
		</TunnelPlaceholder>
    )
}

const ExpandedContent = props => {
    const { activeAppName: appName } = useContext( UIContext )
    const {
        className,
        isExpanded,
    } = props

    if ( !isExpanded ) return null

    const classes = classname({
        'fl-asst-app-header-content-expanded': true,
    }, className )

    const merged = {
        ...props,
        className: classes,
    }
    delete merged.isExpanded

    return (
        <TunnelPlaceholder id={`app-header-expanded-${appName}`} appName={appName} multiple>
			{ ( { items } ) => {
				if ( 'undefined' !== items && 0 < items.length ) {
                    return (
                        <div {...merged}>
                            { items.map( item => item.children )}
                        </div>
                    )
				}
				return null
			} }
		</TunnelPlaceholder>
    )
}

const BarButton = props => {
	const { isExpanded, className } = props
	const line = '2,4 25,4 48,4'
	const up = '5,6 25,2 45,6'

    const classes = classname({
        'fl-asst-button-expand-bar' : true
    }, className )

	const merged = {
        ...props,
        className: classes,
    }
	delete merged.isExpanded

	return (
		<Button {...merged} appearance="transparent">
			<svg className="fl-asst-icon" width="50px" height="8px" viewBox="0 0 50 8">
				<g
					fill="transparent"
					fillRule="nonzero"
					stroke="currentColor"
					strokeWidth="4"
					strokeLinecap="round"
				>
					<polyline points={ isExpanded ? up : line } />
				</g>
			</svg>
		</Button>
	)
}

const ExpanderButton = props => {
    const { activeAppName: appName } = useContext( UIContext )

    return (
        <TunnelPlaceholder id={`app-header-expanded-${appName}`} key={name} multiple>
			{ ( { items } ) => {
				if ( 'undefined' !== items && 0 < items.length ) {

                    return (
                        <div className="fl-asst-app-header-control">
                            <BarButton {...props} />
                        </div>
                    )
				}
				return null
			} }
		</TunnelPlaceholder>
    )
}
