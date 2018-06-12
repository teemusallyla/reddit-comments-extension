var commentVisits = localStorage.commentVisits;
if (!commentVisits) {
    localStorage.setItem("commentVisits", "{}");
    timestamps = {};
} else {
    timestamps = JSON.parse(commentVisits);
}
const id = document.baseURI.split("/")[6];
const dates = timestamps[id];
const colour = "darkorange";

function addTimeStamp() {
    if (Object.keys(timestamps).includes(id)) {
        if (timestamps[id][timestamps[id].length - 1] + 5 * 60 * 1000 < Date.now()) {
            timestamps[id].push(Date.now());
            console.log("timestamp added");
        } else {
            console.log("timestamp not added");
        }
    } else {
        timestamps[id] = [Date.now()];
        console.log("timestamp created");
    }
    var jsonString = JSON.stringify(timestamps)
    localStorage.setItem("commentVisits", jsonString)
}

function addOption(selector, time) {
    var newOption = document.createElement("option");
    newOption.value = time;
    newOption.innerText = new Date(time).toString();
    selector.appendChild(newOption);
}

function createSelector() {
    var newSelector = document.createElement("select");
    newSelector.id = "highlightSelector"
    dates.forEach(date => {
        addOption(newSelector, date);
    })
    document.getElementsByClassName("spacer")[9].appendChild(newSelector);
}

function highlightComments(){
    var selectorValue = document.getElementById("highlightSelector").value;
    Array.from(document.getElementsByClassName("live-timestamp")).forEach(header => {
        header.parentElement.style.backgroundColor = "";
    })
    Array.from(document.getElementsByClassName("live-timestamp")).filter(stamp => new Date(parseInt(selectorValue)) < new Date(stamp.dateTime)).forEach(header => {
        header.parentElement.style.backgroundColor = colour;
    });
    
}

function deleteOld(){
    var toDelete = [];
    Object.keys(timestamps).forEach(thread => {
        var lastDate = timestamps[thread][timestamps[thread].length - 1];
        if (Date.now() > lastDate + 10 * 24 * 60 * 60 * 1000){
            toDelete.push(thread);
        }
    });
    toDelete.forEach(thread => {
        delete timestamps[thread];
        console.log("Thread deleted");
    });
    var jsonString = JSON.stringify(timestamps);
    localStorage.setItem("commentVisits", jsonString);
}

addTimeStamp();
createSelector();
highlightComments();
deleteOld();

setInterval(highlightComments, 500);

document.getElementById("highlightSelector").addEventListener("change", highlightComments);
