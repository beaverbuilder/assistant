
const withWarning = ( Component, message = 'Unstated issue!' ) => {

    console.warn(message)

    return Component
}

export default withWarning
