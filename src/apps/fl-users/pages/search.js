import { __ } from '@wordpress/i18n'
import React, { useContext } from 'fl-react'
import { App, Page, Nav, List } from 'assistant/lib'

export const Search = () => {
    const { handle } = useContext( App.Context )
    return (
        <Page shouldPadSides={ false } title={ __( 'All Users' ) } shouldPadTop={true}>
            <Page.Toolbar>
                <input type="text" placeholder={__('Find User') }/>
            </Page.Toolbar>
            <List.Users
                getItemProps={ ( item, defaultProps ) => ( {
                    ...defaultProps,
                    to: {
                        pathname: `/${handle}/user/${item.id}`,
                        state: { item }
                    },
                } ) }
            />
        </Page>
    )
}
