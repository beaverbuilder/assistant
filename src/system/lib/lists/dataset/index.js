import { useState } from 'fl-react'

const useListLoader = () => {
    const [list, setList] = useState([])

    return {
        items: [],
    }
}
