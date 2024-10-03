module.exports = {
    plugins: {
        autoprefixer: {},
        tailwindcss: {},
        'postcss-remove-rules': {
            rulesToRemove: {
                'img,\nvideo': 'height',
            },
        },
    },
};
