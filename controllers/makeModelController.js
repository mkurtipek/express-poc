const all = require('../public/json/all.json');
const makemodels = require('../public/json/makemodels.json')

function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
}

function compare(a, b) {
    if (a < b) {
        return -1;
    }
    if (a > b) {
        return 1;
    }
    return 0;
}

function getMedian(arr) {
    const arrSort = arr.sort(compare);
    console.log(arrSort);
    const len = arr.length;
    console.log(len);
    const mid = Math.floor(len / 2);
    console.log(mid);

    const median =
        len % 2 == 0 ? (arrSort[mid] + arrSort[mid - 1]) / 2 : arrSort[mid];

    return median;
}

// Display list of all Authors.
exports.search = function (req, res) {
    let makemodel = req.body.makemodel;
    let make = makemodel.split("###")[0];
    let model = makemodel.split("###")[1];
    let startyear = req.body.startyear;
    let endyear = req.body.endyear;
    if (req.body.grade != '') {
        grade1 = req.body.grade - 1;
        grade2 = req.body.grade;
    }
    let startmilage = req.body.startmilage;
    let endmilage = req.body.endmilage;

    console.log(req.body);

    searchresults = all.filter(p => p.Make == make && p.Model == model
        && (startyear == '' || startyear <= p.Year)
        && (endyear == '' || endyear >= p.Year)
        && (req.body.grade == '' || (grade1 <= p.Grade && grade2 >= p.Grade))
        && (startmilage == '' || startmilage <= p.Odometer)
        && (endmilage == '' || endmilage >= p.Odometer)
    );

    let grouped = groupBy(searchresults, pet => pet.Location);
    searchresults = []
    for (var entry of grouped.entries()) {
        var key = entry[0];
        var value = entry[1];
        searchresults.push(value);
    }
    medianresults = []
    for (var entry of grouped.entries()) {
        var key = entry[0];
        var value = entry[1];
        medianresults.push({ "Location": key, "Median": getMedian(value.map(v => v.Price)) });
    }

    res.render('index', {
        title: 'Auto POC - Posted',
        searchresults: searchresults,
        medianresults: medianresults,
        makemodels: makemodels
    })
};