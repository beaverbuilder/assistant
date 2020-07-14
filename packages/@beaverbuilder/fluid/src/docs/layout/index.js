import React from 'react'
import * as Layout from '../../layout'

export default () => (
    <Layout.DropArea onDrop={ ( files, setFiles ) => console.log( 'onDrop', files, setFiles )}>
        <Layout.ContentBoundary>
            <h1>Layout</h1>

            <h2 id="box">Layout.DropArea</h2>
            <p>The DropArea component is a transparent container that listens for file drops and makes the files available via an onDrop callback as well as a context. The onDrop prop accepts a function and will pass the <code>(files, setFiles) => {}</code> arguments.</p>
            <p>Alternatively you can read the provided context from a child component like this:</p>
            <code>const {"{ files, setFiles }"} = Layout.DropArea.use()</code>

            <DropContents />

        </Layout.ContentBoundary>
    </Layout.DropArea>
)

const DropContents = () => {
    const { files } = Layout.DropArea.use()
    return (
        <>
            { 1 > files.length && <h2>Drop some files maybe?</h2> }
            { files.length > 0 && (
                <>
                    <h2>We have {files.length} files!</h2>
                    { files.map( ( file, i ) => {
                        const isImage = file.type.startsWith('image/')
                        const url = URL.createObjectURL( file )
                        return (
                            <Layout.Box key={i}>
                                { isImage && <img src={url} /> }
                                <strong>{file.name}</strong>
                            </Layout.Box>
                        )
                    })}
                </>
            )}
        </>
    )
}
