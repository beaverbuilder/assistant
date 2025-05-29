const fs = require('fs-extra')
const path = require( 'path' )
const isBBBuild = 'true' === process.env.BB_BUILD

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
        'docs',
        'stats.json',
    ].map( name => path.join(fromDir, name) )

    for( let i in ignores ) {
        const path = ignores[i]
        
        if ( src.startsWith( path ) ) {
            return false
        }
    }
    return true
}

const cleanBBBuild = () => {
    if (!isBBBuild) return;

    const flHomeDir = path.join(toDir, 'img/apps/fl-home');
    fs.pathExists(flHomeDir, (err, exists) => {
        if (err) return console.error('Error checking fl-home path:', err);

        if (exists) {
            fs.remove(flHomeDir, err => {
                if (err) return console.error('Error deleting fl-home:', err);
                console.log('Deleted dist img/apps/fl-home');
            });
        }
    });
};

const copyPluginDir = () => {
    // Create fresh Dir to copy into
    fs.ensureDir( toDir , err => {
        if ( err ) return console.error( err )
        fs.copySync( fromDir, toDir, { filter: filterFiles })
        cleanBBBuild()
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
