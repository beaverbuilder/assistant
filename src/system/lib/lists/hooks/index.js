import { useState, useEffect } from 'fl-react'

const hasReachedBounds = e => {
    const el = e.target
    return el.scrollTop + el.clientHeight === el.scrollHeight
}

export const useScrollLoader = ({
    ref = window,
    callback = () => {},
    shouldFetch = hasReachedBounds,
}) => {
    const [isFetching, setIsFetching] = useState(false)

    const handleScroll = e => {
        if ( isFetching ) return

        if ( shouldFetch( e ) ) {
            setIsFetching( true )
        }
    }

    const resetIsFetching = () => setIsFetching( false )

    useEffect( () => {
        if ( 'undefined' !== ref.current ) {
            ref.current.addEventListener('scroll', handleScroll )
            return () => ref.current.removeEventListener('scroll', handleScroll )
        }
    }, [])

    useEffect( () => {
        if ( !isFetching ) return
        if ( 'function' === typeof callback ) {
            callback( resetIsFetching )
        }
    }, [isFetching] )

    return {
        isFetching,
        resetIsFetching: () => setIsFetching( false )
    }
}
