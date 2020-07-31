import { useContext } from 'react'
import CollectionContext from './context'
import Container from './container'
import Item from './item'
import './style.scss'

const Collection = Container

Collection.Item = Item
Collection.use = () => useContext( CollectionContext )

export default Collection
