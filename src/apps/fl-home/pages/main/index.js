import React from 'react'
import { Page, Layout } from 'assistant/ui'
import { HeaderBar, SearchSuggestions } from 'home/ui'
import './style.scss'

const Main = () => {

    return (
        <Page
			id="cards"
			padX={ false }
			padY={ false }
			toolbar={ false }
		>
            <HeaderBar />
            <SearchSuggestions />

            <Layout.Box>
                <p style={{ marginTop: 0 }}>Nullam id dolor id nibh ultricies vehicula ut id elit. Donec id elit non mi porta gravida at eget metus. Sed posuere consectetur est at lobortis. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.</p>
            </Layout.Box>
		</Page>
    )
}

export default Main
