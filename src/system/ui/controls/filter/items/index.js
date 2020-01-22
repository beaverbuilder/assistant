import { __ } from '@wordpress/i18n'
import Filter from '../'

export const RadioGroupItem = ({ items, title, value, defaultValue, onChange = () => {} }) => {

    return (
        <Filter.Item title={title} subtitle={items[value]} isChanged={ value !== defaultValue }>
            {Object.entries(items).map( ( [key, label], i ) => {
                return (
                    <label key={i}>
                        <input
                            type="radio"
                            value={key}
                            onChange={ e => onChange( key, e ) }
                            checked={ value === key }
                        />{label}{ defaultValue === key && ' ' + __('(Default)') }
                    </label>
                )
            })}
        </Filter.Item>
    )
}
