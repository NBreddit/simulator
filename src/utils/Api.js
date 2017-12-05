import axios from 'axios';

function getAvailableBanners(banner) {
    var request = '/weights/' + banner + '.json';
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
    var preValue = 0, summonRates = [];
    var spaceUrl = 'https://dbz.space/cards/';
    var request = '/weights/glb/' + bannerId + '.json';

    if (version === 'Japan') {
        spaceUrl =  'https://jpn.dbz.space/cards/';
        request = '/weights/jpn/' + bannerId + '.json';
    }

    var instance = axios.create({
        headers: {"accept": "application/json;odata=verbose",
            "content-type": "application/json;odata=verbose"}
    });

    return instance.get(request)
        .then(function(response) {
            Object.keys(response.data).map(function(keyName, keyIndex) {
                preValue = response.data[keyName] + preValue;
                
                var type = 'z-normal';
                var id = keyName.toString().split('_')[0];
                var rarity = 1;
                if (rarity === 1 && response.data[keyName] > 0.002) {
                    type = 'b-featured';
                }

                summonRates.push({
                    thumb: "flair flair-" + id,
                    value: preValue, 
                    rarity: rarity,
                    sort: rarity,
                    rate: response.data[keyName],
                    type: type,
                    count: 0
                });
            });
            return summonRates;
        })
        .catch(function(error) {
            return false;
    });
}

export default {
    getBanners(banner) {
        return getAvailableBanners(banner);
    },
    getRates(bannerId, version) {
        return getBannerRates(bannerId, version);
    }
}
