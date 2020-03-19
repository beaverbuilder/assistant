import React from 'react'
import { __ } from '@wordpress/i18n'
import { Page, Icon, Button } from 'assistant/ui'
import { useSystemState, getSystemActions } from 'assistant/data'
import './style.scss'

const ManageScreen = () => {
    const { apps, appOrder } = useSystemState()
    const { setAppPosition } = getSystemActions()

    return (
        <Page title={__('Manage Screen')}>
            <Page.Section label={__('App Order')}>

                <p>{__('You can reorder the apps below. The top 5 will appear in the sidebar for quick access.')}</p>

                <ul className="fl-asst-manage-app-order-list">
                { appOrder.map( ( handle, i ) => {
                    const app = apps[handle]
                    const { label, icon } = app

                    if ( 'undefined' === typeof app || ! app.shouldShowInAppList ) {
						return
					}

					const location = {
						pathname: `/${handle}`,
						state: app,
					}

                    return (
                        <li key={i}>
                            <Button
                                to={location}
                                appearance="transparent"
                                style={{ flex: '1 1 auto' }}
                            >
                                <span className="fl-asst-item-icon">
                                    { icon ? icon({ context: 'sidebar' }) : <Icon.Placeholder /> }
                                </span>
                                {label}
                            </Button>
                            <Button
                                onClick={ () => setAppPosition( handle, i - 1 )}
                                appearance="transparent"
                                title={__('Move Up')}
                            >
                                <Icon.UpCaret />
                            </Button>
                            <Button
                                onClick={ () => setAppPosition( handle, i + 1 )}
                                appearance="transparent"
                                title={__('Move Down')}
                            >
                                <Icon.DownCaret />
                            </Button>
                        </li>
                    )
                })}
                </ul>

            </Page.Section>
        </Page>
    )
}

export default ManageScreen
