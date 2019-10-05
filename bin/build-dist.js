const fs = require('fs-extra')
const path = require( 'path' )

const toDirName = 'assistant'
const fromDir = path.resolve( __dirname, '../' )

// Copies into /wp-content/builds/
const toDir = path.resolve( __dirname, `../../../builds/${toDirName}` )

const filterFiles = src => {

    const removes = [
        '.DS_Store',
        '.git',
        'bin',
        'node_modules',
        'packages',
        'src',
        'tests',
        '.babelrc',
        '.editorconfig',
        '.eslintrc.json',
        '.gitignore',
        '.travis.yml',
        'babel.config.js',
        'composer.json',
        'composer.lock',
        'jest.config.js',
        'package-lock.json',
        'package.json',
        'phpcs.xml',
        'phpunit.xml',
        'README.md',
        'webpack.config.js',
        'lib/README.md',
    ]

    for( let i in removes ) {
        const name = removes[i]
        const path = fromDir + '/' + name
        if ( src.startsWith( path ) ) {
            return false
        }
    }
    return true
}

const copyPluginDir = () => {
    // Create fresh Dir to copy into
    fs.ensureDir( toDir , err => {
        if ( err ) return console.error( err )

        fs.copySync( fromDir, toDir, { filter: filterFiles })
    })
}

const buildPlugin = ( dir ) => {

    console.log('Copying Dir')

    // Check if folder exists. Delete if it does
    fs.pathExists( dir, ( err, exists ) => {

        if ( err ) return console.error( err )

        if ( exists ) {
            fs.remove( dir, err => {
                if ( err ) return console.error( err )
                copyPluginDir()
            } )
        } else {
            copyPluginDir()
        }
    })
}

buildPlugin( toDir )
