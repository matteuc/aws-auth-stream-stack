import glob from "glob"

/**
 * A function to print out the files path in the specified directory that match a certain pattern
 * @param {string} path The path to the directory
 * @param {string} extension The file extension to match for (default is any file)
 */
export async function printDirFiles(path, extension = "*") {
    return new Promise((resolve, reject) => {
        glob(`${path}/*.${extension}`, {}, function (err, files) {

            if (err) {
                reject(err)
                return
            }

            resolve(files)
        })

    })
}

/**
 * A simple function to retrieve the name of a file from its path
 * @param {string} path The path to the file
 */
export function getFileName(path) {
    const fragments = path.split("/")

    if (!fragments.length) {
        console.log("Invalid file path.")
        return null
    }

    const filename = fragments[fragments.length - 1]

    const filenameFragments = filename.split(".")

    return {
        name: filenameFragments[0],
        type: filenameFragments[1],
        original: filename
    }
}
