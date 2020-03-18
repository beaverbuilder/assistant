import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Button, Icon } from 'assistant/ui'
import { useSystemState, getSystemActions } from 'assistant/data'
import './style.scss'

const Sidebar = ({ edge = 'right' }) => {
    const { window, apps, appOrder } = useSystemState()
    const { toggleIsShowingUI, setWindow } = getSystemActions()
    const { pathname } = useLocation()
    const [limitApps, setLimitApps] = useState(true)

	const edgeProp = 'left' === edge ? 'borderRight' : 'borderLeft'

    const toggleWindowSize = () => {
        const sizes = ['mini', 'normal']
        const current = sizes.indexOf( window.size )
        const next = ( current + 1) % sizes.length

        setWindow({ ...window, size: sizes[next] })
    }

	return (
		<div style={{
			flex: '0 0 60px',
            display: 'flex',
            flexDirection: 'column',
			[`${edgeProp}`]: '2px solid var(--fluid-box-background)' }}
		>
            <div className="fl-asst-sidebar-cell">
                <Button appearance="transparent" onClick={ () => toggleIsShowingUI(false) }>
                    <Icon.Close />
                </Button>
            </div>
            <div
                className="fl-asst-sidebar-cell"
                style={{ flex: '1 1 auto' }}
            >
                { appOrder.map( ( handle, i ) => {
                    const app = apps[handle]

                    if ( limitApps && i > 5 ) {
                        return null
                    }

                    if ( 'undefined' === typeof app || ! app.shouldShowInAppList ) {
                        return null
                    }

                    let icon = Icon.Placeholder
                    if ( 'function' === typeof app.icon ) {
                        icon = app.icon
                    }

                    const location = {
                        pathname: `/${handle}`,
                        state: app,
                    }

                    const isSelected = pathname.startsWith(`/${handle}`)

                    return (
                        <Button
                            appearance={ isSelected ? 'normal' : 'transparent' }
                            status={ isSelected ? 'primary' : 'normal' }
                            to={location}
                            title={app.label}
                        >{icon({ context: 'sidebar' })}</Button>
                    )
                })}
                <Button appearance="transparent" onClick={ () => setLimitApps( ! limitApps )}>
                    <Icon.Apps />
                </Button>
            </div>
            <div className="fl-asst-sidebar-cell">
                <Button appearance="transparent" onClick={toggleWindowSize}>
                    <Icon.Expand />
                </Button>
            </div>
        </div>
	)
}

export default Sidebar
