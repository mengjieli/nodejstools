var scores = [
    11.0,
    9.0,
    8.0,
    7.0,
    6.0,
    8.0,
    9.0];

var pers = [
    50,
    5,
    5,
    15,
    5,
    15,
    5
];


var value = 0;
for(var i = 0; i < scores.length; i++) {
    value += scores[i]*pers[i]/100;
}
console.log(value);