module.exports = {
    "env": {
        "browser": true,
        "node":true,
        "amd":true,
        "mocha":true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "linebreak-style": [
            2,
            "unix"
        ],
        "semi": [
            1,
            "always"
        ],
        "no-unused-vars" : [1],
        "no-mixed-spaces-and-tabs" : [0]
    }
};
