import React from 'react'
import { __ } from '@wordpress/i18n'
import { useHistory } from 'react-router-dom'
import { Page, Icon, Button } from 'assistant/ui'
import { useAppList } from 'assistant/data'
import './style.scss'

const ManageScreen = () => {
    const apps = useAppList()
    const history = useHistory()
    const goToRoot = () => history.go( - history.length )

    return (
        <Page title={__('Manage Screen')}>
            <Page.Section label={__('App Order')}>

                <p style={{ marginTop: 0 }}>{__('You can reorder the apps below. The top 5 will appear in the sidebar for quick access.')}</p>

                <ul className="fl-asst-manage-app-order-list">
                <li>
                    <Button appearance="transparent" onClick={goToRoot}>
                        <span className="fl-asst-item-icon">
                            <Icon.Home />
                        </span>
                        {__('Home')}
                    </Button>
                    <span className="fl-asst-item-reorder-buttons" />
                </li>
                { apps.map( ( app, i ) => {
                    const {
                        handle,
                        label,
                        icon,
                        isFirst,
                        isLast,
                        moveUp,
                        moveDown,
                    } = app
					const location = {
						pathname: `/${handle}`,
						state: app,
					}

                    return (
                        <li key={i}>
                            <Button
                                to={location}
                                appearance="transparent"
                                style={{
                                    flex: '1 1 auto',
                                    marginRight: 'auto',
                                }}
                            >
                                <span className="fl-asst-item-icon">
                                    { icon ? icon({ context: 'sidebar' }) : <Icon.Placeholder /> }
                                </span>
                                {label}
                            </Button>

                            <span className="fl-asst-item-reorder-buttons">
                                <span className="fl-asst-button-space">
                                { ! isFirst && (
                                    <Button
                                        onClick={moveUp}
                                        appearance="transparent"
                                        title={__('Move Up')}
                                    >
                                        <Icon.UpCaret />
                                    </Button>
                                )}
                                </span>
                                <span className="fl-asst-button-space">
                                { ! isLast && (
                                    <Button
                                        onClick={moveDown}
                                        appearance="transparent"
                                        title={__('Move Down')}
                                    >
                                        <Icon.DownCaret />
                                    </Button>
                                )}
                                </span>
                            </span>
                        </li>
                    )
                })}
                </ul>
            </Page.Section>
        </Page>
    )
}

export default ManageScreen
