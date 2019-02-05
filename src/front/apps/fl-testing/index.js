import React, { Fragment, useContext } from 'react'
import posed from 'react-pose'
import { ScreenHeader, ExpandedContents, Button, Icon, UIContext, StackContext } from 'components'
import { useDispatch } from 'store'
const { registerApp } = useDispatch()
import './style.scss'

const TestingApp = () => {
    const { pushView } = useContext( StackContext )
    const { goToURL } = useContext( UIContext )

    const imgStyles = {
        backgroundImage: 'url(https://bb-fresh-dev-2.local/wp-content/uploads/2019/01/047ecc32-2e57-34e7-8d77-a4d9974f0038-150x150.jpg)'
    }

    return (
        <Fragment>
            <ScreenHeader />

            <div className="fl-asst-list">
                <ListItemA
                    title="Sed posuere consectetur est at lobortis"
                    meta="The Meta - Line - Contains - Whatever - Meta - You Want - To Include"
                    onClick={ () => goToURL( 'https://www.amazon.com' )}
                    onAccessoryClick={ () => pushView( <DetailView1 /> ) }
                />

                <div className="fl-asst-list-item">
                    Item
                </div>
            </div>
        </Fragment>
    )
}

const ListItemA = ({ title, meta, onClick, onAccessoryClick }) => {
    const imgStyles = {
        backgroundImage: 'url(https://bb-fresh-dev-2.local/wp-content/uploads/2019/01/047ecc32-2e57-34e7-8d77-a4d9974f0038-150x150.jpg)'
    }
    return (
        <div className="fl-asst-list-item">
            <div className="fl-asst-list-item-wrap">
                <div className="fl-asst-list-item-visual">
                    <div className="fl-asst-list-item-image-box" style={imgStyles}></div>
                </div>
                <div className="fl-asst-list-item-content">
                    <div className="fl-asst-list-item-title">{title}</div>
                    <div className="fl-asst-list-item-meta">{meta}</div>
                </div>
                <div>
                    <Button appearance="icon"><Icon /></Button>
                </div>
            </div>
            <ExpandedContents>
                Expanded Contents
            </ExpandedContents>
        </div>
    )
}

const DetailView1 = () => {
    return (
        <Fragment>
            <ScreenHeader title="Detail View 1" />
        </Fragment>
    )
}

registerApp('fl-testing', {
    label: 'Testing Lists',
    content: () => <TestingApp />,
})
