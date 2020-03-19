
const Icon = ({ context }) => {

    if ( 'sidebar' === context ) {
        return (
            <svg width="14" height="20" viewBox="0 0 14 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 7C13 11.292 7.85714 17.5286 7 18.5C6.14286 17.5286 1 11.292 1 7C1 4 3.57143 1 7 1C10.4286 1 13 4 13 7Z" stroke="currentColor" strokeWidth="2"/>
                <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="2"/>
            </svg>
        )
    }

    return null
}

export default Icon
