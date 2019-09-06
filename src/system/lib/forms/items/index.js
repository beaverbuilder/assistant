import React from 'fl-react'
import { Form } from '../'

export const TextItem = ({
    label,
    labelPlacement,
    type = 'text',
    id,
    value,
    isRequired = false,
    onChange = v => console.log('updated', v ),
    ...rest,
}) => {

    return (
        <Form.Item label={label} placement={labelPlacement} labelFor={id} isRequired={isRequired}>
            <input type={type} key={id} id={id} value={value} onChange={onChange} {...rest} />
        </Form.Item>
    )
}

/*
const createFormHook = ( config, initial = {} ) => {
    return () => {

        const reducer = ( state, action ) => {
            let newState = { ...state }

            switch ( action.type ) {
            case 'SET_VALUE':
                newState[action.key] = action.value
                return newState

            default:
                return state
            }
        }
        const [ state, dispatch ] = useReducer( reducer, initial )

        let obj = {}

        for ( var handle in config ) {
            obj[handle] = {
                ...config[handle],

                value: state[handle],

                onChange: e => {
                    const value = e.target.value
                    dispatch({
                        type: 'SET_VALUE',
                        key: handle,
                        value: value,
                    })
                    if ( 'function' === typeof config[handle].onChange ) {
                        config[handle].onChange( value )
                    }
                },
            }
        }

        return obj
    }
}*/
