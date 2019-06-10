import React, { useState, useEffect } from 'fl-react'
import { Switch, Route, Link } from 'fl-react-router-dom'
import { Page } from 'assistant/lib'
import { getContent } from 'utils/wordpress'

export const Alerts = ( { match } ) => (
    <Switch>
        <Route exact path={`${match.url}/`} component={Main} />
        <Route path={`${match.url}/comments/:id`} component={CommentDetail} />
    </Switch>
)

const Main = ({ match }) => {
    const [comments, setComments] = useState( [] )

    useEffect( () => {
        getContent( 'comments', {}, data => setComments(data) )
    }, [])

    const style = {
        display: 'block',
        padding: 'var(--fl-asst-outer-space) 0',
    }

    return (
        <Page>
            <ul>
                { comments.map( ( item, i ) => {
                    const { id, meta: authorDate, title } = item
                    const location = {
                        pathname: `${match.url}/comments/${id}`,
                        state: item,
                    }
                    return (
                        <li key={i}>
                            <Link to={location} style={style}>
                                <div>{authorDate}</div>
                                <div>{title}</div>
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </Page>
    )
}

const CommentDetail = ({ history, match, location }) => {
    const { params } = match
    const comment = {
        ...location.state,
    }
    const { content } = comment
    return (
        <Page>
            <button onClick={ () => history.goBack() }>Back</button>
            <div dangerouslySetInnerHTML={{ __html: content }} />
        </Page>
    )
}

Alerts.Icon = () => {}
