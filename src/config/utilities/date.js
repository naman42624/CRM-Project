const newDateTopBar = function (){
    let today = new Date();
    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }
    let day = today.toLocaleDateString("en-US", options);
    return day;
}

const newDate = function (){
    let today = new Date();
    let options = {
        year: "numeric",
        day: "numeric",
        month: "numeric"
    }
    let day = today.toLocaleDateString("en-GB", options);
    return day;
}

module.exports.newDateTopBar = newDateTopBar;
module.exports.newDate = newDate;
