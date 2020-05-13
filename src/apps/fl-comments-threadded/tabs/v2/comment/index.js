import React from 'react'
import classname from 'classnames'
import LimitContent from '../limit-content'
import { Layout, Button } from 'assistant/ui'
import { motion } from 'framer-motion'
import './style.scss'

const Gutter = ({ isPending = false, isSpam = false }) => {
    return (
        <div className="fl-asst-comment-gutter">
            <div className="fl-asst-thread-line" />
            { ( isPending || isSpam ) && (
                <div className="fl-asst-gutter-dot-area">
                    <div className={ classname({
                        'fl-asst-dot' : true,
                        'is-pending' : isPending,
                        'is-spam' : isSpam
                    })} />
                </div>
            ) }
        </div>
    )
}

const Author = ({ name, avatar, date }) => {
    return (
        <div className="fl-asst-comment-header">
            <div className="fl-asst-comment-avatar">
                <Layout.AspectBox
                    style={{
                        width: 30,
                        backgroundImage: `url(${ avatar })`,
                        backgroundSize: 'cover'
                    }}
                />
            </div>
            <div className="fl-asst-comment-author-name">
                {name}
                { date && <span className="fl-asst-comment-since">{date}</span> }
            </div>
        </div>
    )
}

const Meta = ({ url, ip, email }) => {
	return (
		<div className="fl-asst-comment-meta" >
			{ url && <a className="fl-asst-comment-meta-value" href={url}>{url}</a> }
			{ ip && <div className="fl-asst-comment-meta-value">{ip}</div> }
			{ email && <a className="fl-asst-comment-meta-value" href={`mailto:${email}`}>{email}</a> }
		</div>
	)
}

export default ({
    content,
    isPending,
    isSpam,
    author,
    extras: Extras,
    to,
}) => {
    return (
        <motion.li
            initial={{ scale: .5 }}
            animate={{ scale: 1 }}
        >
            <Button to={to} style={{ display: 'flex', flexDirection: 'row', padding: 0 }}>
                <Gutter isPending={isPending} isSpam={isSpam} />
                <div className="fl-asst-comment-cell">
                    <Author {...author} />
                    { isPending && <Meta {...author} /> }
                    <LimitContent>
                        <div className="fl-asst-comment-content"
                            dangerouslySetInnerHTML={ { __html: content } }
                        />
                    </LimitContent>
                </div>
            </Button>
            <Extras />
        </motion.li>
    )
}
