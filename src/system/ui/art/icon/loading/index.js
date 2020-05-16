import React from 'react'

const Loading = ({ ...rest }) => {
    return (
        <svg width={20} height={20} viewBox='0 0 20 20' xmlns="http://www.w3.org/2000/svg" {...rest}>
            <circle
                cx="10"
                cy="10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="50"
                strokeLinecap="round"
                r="9"
            />
            <animateTransform
                attributeName="transform"
                type="rotate"
                by="360"
                dur="1s"
                repeatCount="indefinite"
            />
        </svg>
    )
}

export default Loading
