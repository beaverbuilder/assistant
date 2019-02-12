
export function truncate(string, words = 5) {
    if ( !string || !words ) return

    return string.split(' ').slice(0, words).join(' ')
}
