import React from 'react'
import { CardPage } from '../cards'
import { Page } from 'assistant/ui'

const Main = () => {

    return (
        <Page
			id="cards"
			padX={ false }
			padY={ false }
			toolbar={ false }
		>
			<CardPage
				page="home"
			/>
		</Page>
    )
}

export default Main
