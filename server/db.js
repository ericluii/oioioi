var mongoose = require('mongoose');
var db = mongoose.connection;

var lonely = "";

db.on('error', console.error);
db.once('open', function() {
    var pairSchema = new mongoose.Schema({
        alpha: String,
        omega: String
    });
    var Pair = mongoose.model('Pair', pairSchema);
});

addPair = function(l1, l2) {
    var pair = new Pair({
        alpha: l1,
        omega: l2
    });
    pair.save(function(err, pair){
        if (err) return console.error(err);
        console.dir(pair);
    });
}

export.isConnected = function(number) {
    if (number == lonely) return true;
    else {
        Pair.find(function(err, pairs){
            if (err) return console.error(err);
            console.dir(pairs);
            for (pair in pairs) {
                if(pair.alpha == number || pair.omega == number) return true;
            }
        });
        return false;
    }
}

isPaired = function(number) {
    Pair.findOne($or: [{alpha:number},{omega:number}], function(err, pair) {
        if (err) return false;
        return true;
    });
}

export.newUser = function(number) {
    if (isConnected(number)){
        console.error('Invalid use. Not a new user.');
        return;
    }
    if (lonely == "") lonely = number;
    else {
        addPair(lonely,number);
        lonely = "";
    }
}

export.reconnectUser = function(number) {
    if (isPaired(number)) {
        var toLonely = getPairedNumber(number);
        getPair().remove();
        newUser(toLonely);
    }
    else console.error('Invalid use. Number does not have a pair.');
}

getPair = function (number) {
    Pair.findOne($or: [{alpha:number},{omega:number}], function(err, pair) {
        if (err) return console.error("Invalid use. Number does not have a pair.");
        return pair;
    });
}

export terminateUser = function(number) {
    if (number==lonely) {
        lonely = "";
        return;
    }
    else if (isConnected(number)) reconnectUser(number);
    else console.error("Invalid use. Number is not recognized.");
}

export.getPairedNumber = function(number) {
    if(isPaired(number)) {
        return getPair(number);
    }
    else return console.error("Invalid use. Number does not have a pair.");
}

mongoose.connect('mongodb://localhost/oy');