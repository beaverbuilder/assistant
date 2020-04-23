import React, { useState } from 'react'
import { __ } from '@wordpress/i18n'
import { Page, Button, Icon } from 'assistant/ui'
import { Header, CardPage } from './ui'
import './style.scss'

const CardsApp = () => {
    const [isEditing, setIsEditing] = useState( true )
    return (
        <Page
            id="cards"
            title={ isEditing ? __('Edit Cards') : __('Cards')}
            padX={false}
            padY={false}
            header={<Header />}
            toolbar={ false }
        >
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                minHeight: 'var(--fluid-target-size)',
                justifyContent: 'flex-end',
                padding: 2
            }}>
                <Button
                    onClick={ () => setIsEditing( !isEditing ) }
                >
                    { isEditing ? __('Done') : <Icon.Edit /> }
                </Button>
            </div>
            <CardPage
                page="home"
                isEditing={isEditing}
            />
        </Page>
    )
}

export default CardsApp
