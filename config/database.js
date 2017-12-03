if (process.env.NODE_ENV === 'production') {
    module.exports = {
        mongoURI: 'mongodb://Tahywoh:adeshina@ds129066.mlab.com:29066/videoideas'
    }
} else {
    module.exports = {
        mongoURI: 'mongodb://localhost/videoIdea-taiwo'
    }
}