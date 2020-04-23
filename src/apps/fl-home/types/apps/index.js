import React from 'react'
import { useAppList } from 'assistant/data'
import { Button } from 'assistant/ui'

const Apps = () => {
    const apps = useAppList()
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridGap: 5 }}>
        {apps.map( app => {
            console.log(app)
            const { label, icon: AppIcon, handle } = app
            return (
                <Button
                    appearance="transparent"
                    to={`/${handle}`}
                    style={{ justifyContent: 'flex-start' }}
                >
                    <span style={{ marginRight: 'var(--fluid-lg-space)'}}>
                        <AppIcon context="sidebar" />
                    </span>
                    {label}
                </Button>
            )
        })}
        </div>
    )
}

Apps.Edit = () => null

export default Apps
