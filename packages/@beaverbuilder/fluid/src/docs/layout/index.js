import React from 'react'
import * as Layout from '../../layout'

export default () => (
    <Layout.DropArea>
        <Layout.ContentBoundary>
            <h1>Layout</h1>

            <h2 id="box">Box</h2>
            <p>Something about the box component</p>

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
                        console.log( file, i )
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
