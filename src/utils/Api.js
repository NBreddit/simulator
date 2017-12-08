import axios from 'axios';

function getAvailableBanners() {
    var request = '/Simulator/configuration/banners.json';
    //request = '/configuration/banners.json';
    var instance = axios.create({
        headers: {"accept": "application/json;odata=verbose",
            "content-type": "application/json;odata=verbose"}
    });

    return instance.get(request)
      .then(function(response) {
        return response.data;
      })
      .catch(function(error) {
        return false;
    });
}


function getBannerRates(bannerId, version) {
    var summonValue = 0, summonRates = [];
    var request = '/Simulator/configuration/banners/' + bannerId + '.json';
    //request = '/configuration/banners/' + bannerId + '.json';

    var instance = axios.create({
        headers: {"accept": "application/json;odata=verbose",
            "content-type": "application/json;odata=verbose"}
    });

    return instance.get(request)
        .then(function(response) {
            Object.keys(response.data).map(function(keyName, keyIndex) {
                var rate = response.data[keyName].rate;
                var unitCount = response.data[keyName].units.length;
                var ratePerUnit = rate/unitCount;

                var rarity = keyName.toString().split('_')[1];
                var sort = 1;

                switch (rarity) {
                    case '5':
                        sort = 1;
                        break;
                    case '4':
                        sort = 2;
                        break;
                    case '3':
                        sort = 3;
                        break;
                    default:
                        sort = 4;
                }

                var type = 'z-normal';
                if (keyName.toString().split('_')[0] === 'featured') {
                    type = 'b-featured';
                }

                for (var i = 0; i < unitCount; i++) {
                    summonValue = ratePerUnit + summonValue;

                    summonRates.push({
                        thumb: "flair flair-" + response.data[keyName].units[i],
                        value: summonValue,
                        rarity: rarity,
                        sort: sort,
                        rate: ratePerUnit,
                        type: type,
                        count: 0
                    });
                }
            });
            return summonRates;
        })
        .catch(function(error) {
            return false;
    });
}

export default {
    getBanners() {
        return getAvailableBanners();
    },
    getRates(bannerId, version) {
        return getBannerRates(bannerId, version);
    }
}
