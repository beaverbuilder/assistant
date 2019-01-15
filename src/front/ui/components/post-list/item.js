import React from 'react'
import { Icon, Button } from 'components'

export const PostListItem = props => {
    const { post } = props
    const viewPost = () => window.location.href = post.url
    const editPost = () => window.location.href = post.edit_url
    const thumbStyles = {
        backgroundImage: post.thumbnail ? `url(${ post.thumbnail })` : '',
    }

    return (
        <li className="fl-asst-list-item">
            <div className="fl-asst-list-item-visual" onClick={ viewPost }>
                <div className="fl-asst-list-item-image-box" style={ thumbStyles }></div>
            </div>
            <div className="fl-asst-list-item-content" onClick={ viewPost }>
                <div className="fl-asst-list-item-title">{ post.title }</div>
                <div className="fl-asst-list-item-meta">By { post.author } - { post.date }</div>
            </div>
            <div className="fl-asst-list-item-actions">
                <Button onClick={ viewPost }>View</Button>
                <Button onClick={ editPost }>Edit</Button>
                <Button><Icon name="star-outline" /></Button>
                <Button><Icon name="more" /></Button>
            </div>
        </li>
    )
}
