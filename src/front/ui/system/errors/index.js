import React, { Component, useState, useEffect } from 'react'
import { __ } from '@wordpress/i18n'
import UAParser from 'ua-parser-js'
import { Heading, Form, Branding } from 'components'

export class ErrorBoundary extends Component {
    constructor(props) {
        super(props)
        this.state = {
            hasError: false
        }
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true }
    }

    componentDidCatch(error, info) {
        // You can also log the error to an error reporting service
        //console.error(error, info)
    }

    render() {
        const { alternate, children } = this.props
        const { hasError } = this.state
        if ( hasError ) {
            return alternate
        }
        return children
    }
}

export const OuterErrorBoundary = props => {
    const merged = {
        ...props,
        alternate: <OuterErrorScreen />,
    }
    return (
        <ErrorBoundary {...merged} />
    )
}

const OuterErrorScreen = () => {

    const styles = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    }

    return (
        <div className="fl-asst-appearance-form" style={styles}>
            <span style={{ color: 'var(--fl-asst-error-color)' }}><Branding name="outline" size={75} /></span>
            <Heading style={{marginTop: 30}}>{__('Oh no! There seems to be problem.')}</Heading>
            <Diagnostics />
        </div>
    )
}

const Diagnostics = () => {
    const defaults = {
        browser: {
            name: null,
            version: null,
            major: null,
        },
        os: {
            name: null,
            version: null,
        }
    }
    const [results, setResults] = useState( defaults )

    useEffect( () => {
        const parser = new UAParser()
        setResults( parser.getResult() )
    }, [])
    const { browser, os } = results

    return (
        <div style={{ width: '100%' }}>
            <form>
                <Form.Section label={__('System Details')} isInset={true}>
                    <Form.Item label={__('Browser')} placement='beside'>{browser.name} {browser.version}</Form.Item>
                    <Form.Item label={__('Operating System')} placement='beside'>{os.name} {os.version}</Form.Item>
                </Form.Section>
            </form>
        </div>
    )
}
