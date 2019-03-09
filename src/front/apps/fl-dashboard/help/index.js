import React, { Fragment } from 'react'
import { getSystemConfig, useSystemState } from 'store'
import {
	Padding,
	Heading,
	Branding,
	Tabs,
	Icon,
} from 'components'
import { render } from 'utils/react'
import './style.scss'

export const Help = () => {
    const { currentUser } = getSystemConfig()
    const { apps } = useSystemState()
    const half = "calc( var(--fl-asst-base-padding) / 2 )"

	const tabs = [
        {
            label: "Dashboard",
			icon: render( apps['fl-dashboard'].icon ),
            content: (
				<Fragment>
					<Heading>Dashboard</Heading>
	                <div>The Dashboard app gives you a glance at what's happening in your website. Each section gives you a taste of one aspect of your site.</div>
				</Fragment>
            ),
        },
        {
            label: 'Content',
			icon: render( apps['fl-find'].icon ),
            content: 'Content Content',
        },
        {
            label: 'Media',
			icon: render( apps['fl-media'].icon ),
            content: 'Media Content',
        },
		{
            label: 'Users',
            icon: render( apps['fl-users'].icon ),
            content: 'Users Content',
        },
		{
            label: 'Apps',
            icon: <Icon name="apps-app" />,
            content: 'Apps Menu Content',
        },
		{
            label: 'Notifications',
            icon: <Icon name="default-app" />,
            content: 'Notifications Content',
        },
    ]

    return (
        <Fragment>
			<ToolbarLabels />
            <Padding bottom={half}>
                <BrandIcon />
                <Heading level={1}>{`Welcome, ${currentUser.name}`}</Heading>
                <p style={{margin:0}}>Assistant provides apps to help you navigate and manage your WordPress website. You can learn about these apps below.</p>
            </Padding>
            <Padding top={false} left={half} right={half}>
                <Tabs tabs={tabs} />
            </Padding>
        </Fragment>
    )
}

const BrandIcon = () => {
	const styles = {
		width: 68,
		height: 63,
		borderRadius: 10,
		background: 'var(--fl-utility-background-color)',
		boxShadow: '0px 1px 2px rgba( 0, 0, 0, .2 )',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 'calc( var(--fl-asst-base-padding) / 2 )'
	}
	return (
		<div style={styles}>
			<Branding size={50} />
		</div>
	)
}

const ToolbarLabels = () => {

	const noteStyles = {
		flex: '1 1 auto'
	}

	const hideStyles = {
		display: 'flex',
		justifyContent: 'flex-end',
		flex: '1 1 auto',
		paddingRight: 8,
	}
	const more = {
		flex: '1 1 auto',
		display: 'flex',
		justifyItems: 'center',
		paddingLeft: 4,
	}

	return (
		<div className="fl-asst-toolbar-labels">
			<div className="fl-asst-toolbar-label-cell" style={noteStyles}>Notifications</div>

			<div className="fl-asst-toolbar-label-center">
				<div className="fl-asst-toolbar-label-center-wrap">
					<div className="fl-asst-toolbar-label-cell fl-asst-toolbar-label-cell-apps">
							<span>Apps</span>
						</div>
					<div className="fl-asst-toolbar-label-cell" style={more}>More</div>
				</div>
			</div>

			<div className="fl-asst-toolbar-label-cell" style={hideStyles}>Hide</div>
		</div>
	)
}
