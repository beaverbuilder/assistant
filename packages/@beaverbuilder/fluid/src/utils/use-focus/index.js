import { useState } from 'react'

const useFocus = () => {

    const [isFocused, setIsFocused] = useState(false)
    const focusProps = {
        onFocus: () => setIsFocused(true),
        onBlur: () => setIsFocused(false),
    }

    return [isFocused, focusProps]
}

export default useFocus
