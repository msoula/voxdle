// https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript/47593316#47593316
// seeded random generator: var random = xmur3('Seed'); var rand = random();
// val between 0 and 0xFFFFFFFF (32 bit val)
function xmur3(str) {
    for(var i = 0, h = 1779033703 ^ str.length; i < str.length; i++) {
        h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
        h = h << 13 | h >>> 19;
    }
    return function() {
        h = Math.imul(h ^ h >>> 16, 2246822507);
        h = Math.imul(h ^ h >>> 13, 3266489909);
        return (h ^= h >>> 16) >>> 0;
    };
}

function mulberry32(a) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

// https://stackoverflow.com/a/12646864
function shuffleArray(array, randFunction) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(randFunction() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export default {
    shuffle: (array) => shuffleArray(array, mulberry32(xmur3('To infinity and beyond')()))
}


// vim: set ts=4 sw=4 expandtab:
