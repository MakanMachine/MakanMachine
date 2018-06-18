const cacheProvider = require('./cacheProvider');
const cacheService = require('./cacheService'); 

cacheProvider.start();
cacheService.recommend('Malay');
