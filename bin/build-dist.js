const fs = require('fs-extra')
const path = require( 'path' )

// Copies plugin folder
const fromDir = path.resolve( __dirname, '../' )

// Copies into /wp-content/dist/
const toDirName = 'assistant'
const toDir = path.resolve( __dirname, `../../../dist/${toDirName}` )

const filterFiles = src => {

    // Get paths to ignore
    const ignores = [
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
        'scoper.inc.php',
        'webpack.config.js',
        'lib/README.md',
        'vendor',
        'backend/tests',
    ].map( name => `${fromDir}/${name}` )

    for( let i in ignores ) {
        const path = ignores[i]
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
