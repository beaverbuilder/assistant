import React from 'react'
import { useAppList } from 'assistant/data'
import { Button } from 'assistant/ui'
import { motion } from 'framer-motion'

const Apps = () => {
    const apps = useAppList()
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridGap: 5 }}>
        {apps.map( app => {
            const { label, icon: AppIcon, handle } = app
            return (
                <motion.div
                    key={handle}
                    positionTransition
                    style={{
                        display: 'flex',
                        flexDirection: 'row'
                    }}
                >
                    <Button
                        appearance="transparent"
                        to={`/${handle}`}
                        style={{
                            flex: '1 1 auto',
                            justifyContent: 'flex-start'
                        }}
                    >
                        <span style={{ marginRight: 'var(--fluid-lg-space)'}}>
                            <AppIcon context="sidebar" />
                        </span>
                        {label}
                    </Button>
                </motion.div>
            )
        })}
        </div>
    )
}

Apps.Edit = () => null

export default Apps
