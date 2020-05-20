import React from 'react'
import { __ } from '@wordpress/i18n'
import { Card } from 'home/ui'
import { getSystemConfig } from 'assistant/data'

const CurrentlyViewing = () => {
    const { currentPageView } = getSystemConfig()
    const { intro, name } = currentPageView
    return (
        <Card
            eyebrow={intro}
            title={name}
        />
    )
}

export default CurrentlyViewing
