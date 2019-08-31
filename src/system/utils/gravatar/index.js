import md5 from "md5";

export const gravatar = ( email = null, size = 75 ) => {
    if ( !!email ) {
        return 'https://gravatar.com/avatar/avatar.jpg'
    }

    const emailHash = md5( email )
    return `http://www.gravatar.com/avatar/${emailHash}.jpg?s=${size}`
}
