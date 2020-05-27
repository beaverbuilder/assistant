import React from 'react'
import { __ } from '@wordpress/i18n'
import { Button, Icon } from 'assistant/ui'
import { getSystemConfig } from 'assistant/data'
import AppIcon from '../icon'
import './style.scss'

const SplitView = ({ sidebar, children }) => {

    return (
        <div className="fl-asst-split-view">
            <div className="fl-asst-split-view-master">
                {sidebar}
            </div>
            <div className="fl-asst-split-view-detail">
                {children}
            </div>
        </div>
    )
}

const Sidebar = () => {
    const { contentTypes } = getSystemConfig()

	const getTabs = () => {
		let tabs = []
		Object.keys( contentTypes ).map( key => {
			const type = contentTypes[key]
			tabs.push( {
                replace: true,
				handle: key,
				path: '/fl-content/tab/' + key,
				label: type.labels.plural,
			} )
		} )

		return tabs
	}
	const tabs = getTabs()

    return (
        <div className="fl-asst-content-sidebar">
            <div className="fl-asst-sidebar-title">
                <Icon.Safely icon={AppIcon} style={{ marginRight: 10 }} />
                {__('Content')}
            </div>
            <div className="fl-asst-sidebar-content">

                <div className="fl-asst-sidebar-section">
                    <div className="fl-asst-sidbear-section-title">Post Types</div>
                    <div className="fl-asst-sidebar-section-content">
                        { tabs.map( ({ handle, path, label }) => (
                            <Button key={handle} to={path} appearance="transparent">{label}</Button>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}

export { SplitView, Sidebar }
