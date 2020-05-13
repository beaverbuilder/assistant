import { getWpRest } from 'assistant/utils/wordpress'

export const defaultState = {
    type: 'hold',
}

/*
const defaultPost = {
    id: null,
    title: 'Loading...',
    thumbnail: '',
    totalComments: 0,
    totalPending: 0,
    comments: [],
}
const mapComment = comment => {
    const defaultComment = {
        id: null,
        formattedData: '',
        author: {
            name: '',
            email: null,
            ip: null,
            url: null,
            avatar: null
        },
        url: '',
        editURL: '',
        isPending: false,
        isSpam: false,
        isTrash: false,
        content: ''
    }
    const {
        id,
        date,
        content,
        author,
        authorEmail,
        authorIP,
        url,
        editUrl,
        approved,
        spam,
        trash,
        thumbnail
    } = comment

    return {
        ...defaultComment,
        id,
        formattedDate: date,
        author: {
            name: author,
            email: authorEmail,
            ip: authorIP,
            avatar: thumbnail,
            url: null
        },
        url,
        editURL: editUrl,
        isPending: ! approved && ! spam && ! trash,
        isSpam: spam,
        isTrash: trash,
        content
    }
}

const mapCommentsToPosts = ( comments = [], store ) => {
    const posts = {}

    comments.map( comment => {
        const { postId } = comment
        posts[ postId ] = posts[ postId ] || {
            ...defaultPost,
            id: postId,
        }

        const newComment = mapComment( comment )
        posts[ postId ].comments = [ ...posts[ postId ].comments, newComment ]
        posts[ postId ].totalComments++
        if ( newComment.isPending ) {
            posts[ postId ].pendingComments++
        }
    })

    return Object.values( posts ).map( post => {

        getWpRest().posts().findById( post.id ).then( response => {
            const { id, title, thumbnail } = response.data
            store.dispatch({
                type: 'UPDATE_POST_META',
                id,
                title,
                thumbnail
            })
        })

        return post
    })
}
*/

export const onMount = () => {
    //const wp = getWpRest()

    /*
    store.dispatch({
        type: 'SET_IS_LOADING',
        value: true
    })

    wp.comments().findWhere().then( response => {
        store.dispatch({
            type: 'SET_IS_LOADING',
            value: false
        })
        store.dispatch({
            type: "SET_POSTS",
            posts: mapCommentsToPosts( response.data.items, store )
        })
    })

    return () => {
        store.dispatch({
            type: "SET_POSTS",
            posts: []
        })
    }
    */
}

export const reducers = {
    /*
    posts: ( state = [], action ) => {
        switch( action.type ) {
            case 'SET_POSTS':
                return action.posts
            case 'UPDATE_POST_META':

                const i = state.findIndex( item => item.id === action.id )
                if ( i ) {
                    const { id, title, thumbnail } = action
                    return state.map( item => {
                        if ( item.id === id ) {
                            return {
                                ...item,
                                title,
                                thumbnail
                            }
                        }
                        return item
                    })
                }
                return state
            default:
                return state
        }
    },
    isLoading: ( state = true, action ) => {
        switch( action.type ) {
            case 'SET_IS_LOADING':
                return action.value ? true : false
            default:
                return state
        }
    }
    */
}

export const effects = {
    after: {}
}
