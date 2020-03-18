import { Icon } from 'assistant/ui'

const LabelsIcon = ({ context }) => {

    if ( 'sidebar' === context ) {
		return <Icon.Placeholder />
	}

    return (
    	<svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
    		<circle cx="7.5" cy="26.5" r="6.25" stroke="#F8D247" strokeWidth="2.5"/>
    		<circle cx="26.5" cy="26.5" r="6.25" stroke="#EB426A" strokeWidth="2.5"/>
    		<circle cx="7.5" cy="7.5" r="6.25" stroke="#5FCF88" strokeWidth="2.5"/>
    		<circle cx="26.5" cy="7.5" r="6.25" stroke="#51ABF2" strokeWidth="2.5"/>
    	</svg>
    )
}

export default LabelsIcon
