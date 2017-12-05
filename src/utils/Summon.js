function doSingle(summonRates) {
    var randomValue = Math.random();
    var results = [];
    
    for (var i = 0, len = summonRates.length; i < len; i++) {
        if(randomValue <= summonRates[i].value) {
            results.push(summonRates[i]);
            break;
        }
    }
    return results;
}

function doMulti(summonRates, type) {
    var multiResults = [];

    for (var k = 0; k < 10; k++) {
        var randomValue = Math.random();    
        if (k === 9 && type !== 'Standard') {
            multiResults.push(specialSummon(summonRates, type, randomValue));
        }
        else {    
            for (var i = 0, len = summonRates.length; i < len; i++) {
                if(randomValue <= summonRates[i].value) {
                    multiResults.push(summonRates[i]);
                    break;
                }
            }
       }
    }
    return multiResults;
}

function specialSummon(allRates, type, randomValue) {
    // Need a deep copy of the array to prevent summonRates from getting screwed up
    var copy = JSON.parse(JSON.stringify(allRates));
    var summonPool = [], rateTotal = 0;

    //Create a new pool of cards based on summon type
    for (var i = 0, len = copy.length; i < len; i++) {
        if ((copy[i].type.includes('b-featured') && type === 'fGSSR') || (copy[i].sort === 1 && type === 'GSSR')) {
            copy[i].indexPos = i;
            summonPool.push(copy[i]);
            rateTotal = copy[i].rate + rateTotal;
        }
    }

    //Set a new multiplier and the new pool values
    var multiplier = 1/rateTotal, preValue = 0;
    for (var k = 0; k < summonPool.length; k++) {
        preValue = summonPool[k].rate * multiplier + preValue;
        summonPool[k].value = preValue;
    }
    
    //Select card, but return from original array not the copy
    for (var j = 0; j < summonPool.length; j++) {
        if(randomValue <= summonPool[j].value) {
            return allRates[summonPool[j].indexPos];
        }
    }
}

function compressArray(original) {
    var compressed = [];
    // make a copy of the input array
    var copy = original.slice(0);

    // first loop goes over every element
    for (var i = 0; i < original.length; i++) {

        var myCount = 0;	
        // loop over every element in the copy and see if it's the same
        for (var w = 0; w < copy.length; w++) {
            if (original[i] === copy[w]) {
                // increase amount of times duplicate is found
                myCount++;
                // sets item to undefined
                delete copy[w];
            }
        }

        if (myCount > 0) {
            var a = {};
            a = original[i];
            if (a.count === 0) {
                a.count = myCount;
            }
            else {
                a.count = (a.count-1) + myCount;
            }
            compressed.push(a);
        }
    }	
    return compressed;
}


export default {
    Single(summonRates) {
        return doSingle(summonRates);
    },
    Multi(summonRates, type) {
        return doMulti(summonRates, type);
    },
    Compress(array) {
        return compressArray(array);
    }
}
