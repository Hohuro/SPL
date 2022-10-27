const axios = require('axios');

async function getData(url) {
    try {
        const res = await axios.get(url);
        return res.data;
    }
    catch (error) {
        console.log(error);
    }
}

module.exports = { getData };
