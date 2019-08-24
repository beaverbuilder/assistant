export const cssPrefixer = (prefix) => {
    return (className) => {
        return `${prefix}-${className}`
    }
}
