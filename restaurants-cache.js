const fs = require('fs');
var axios = require('axios');
var util = require('util');

axios({
    method:'get',
    url:'https://enigmatic-forest-44322.herokuapp.com/api/restaurants',
    auth: {
        username: 'x-api-key',
        password: 'bd345546-672d-4f09-b25a-97e7eebc6ac2'
    },
    responseType: 'json'
})
    .then(function(response) {
        const content = util.inspect(response);
        fs.writeFile("./allRestaurants.json", content, function(err) {
            if (err)
                return console.log(err);
            console.log("All restaurants data written");
        });
    })
    .catch(function(error) {
        console.log(error)
    });
