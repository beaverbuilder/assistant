import React, { Fragment, useEffect, useState, useRef } from 'react'
import classname from 'classnames'
import { getPosts } from 'utils/rest-api'
import { Icon } from 'components'
import { PostItem } from 'components/post-list/item'
import { PostListFilter } from 'components/post-list/filter'
import './style.scss'

export const PostList = props => {
    const [ posts, setPosts ] = useState( null )
	const [ search, setSearch ] = useState( '' )
    const { type } = props
    const classes = classname( {
        'fl-asst-list': true,
        'fl-asst-post-list': true
    } )

    useEffect( () => {
		setSearch( '' )
    }, [ type ] )

	useEffect( () => {
		setPosts( null )
		const request = getPosts( { type, search }, data => setPosts( data ) )
		return () => request.cancel()
    }, [ type, search ] )

    return (
		<Fragment>
			<PostListFilter
				key={ type }
				onChange={ value => setSearch( value ) }
			/>
			{ ! posts &&
				<div className="fl-asst-list-loading">
					<Icon name="spinner" />
				</div>
			}
			{ posts &&
				<ul className={ classes }>
					{ posts.map( ( post, key ) =>
						<PostItem
							key={ key }
							post={ post }
						/>
					) }
				</ul>
			}
		</Fragment>
    )
}

export { PostItem } from './item'
