'use strict'

// JQuery only for using AJAX to make server calls
// Everything else is implemented in vanilla JS.

const checkboxes = document.querySelectorAll(".checkbox");
checkboxes.forEach((el) => {
    el.addEventListener('click', function (evt) {
        hideColumn(evt.target)
    });
})

var tempData = [];

function hideColumn(trg) {
    var header = document.querySelector("." + trg.name)
    if (!trg.checked) {
        header.classList.add("hidden");
    } else {
        header.classList.remove("hidden");
    }

    tempData.forEach((elem) => {
        elem.querySelectorAll("." + trg.name).forEach((el) => {
            if (!trg.checked) {
                el.classList.add("hidden");
            } else {
                el.classList.remove("hidden");
            }
        })
    })
}

const table = document.querySelector('table');

function loadData() {
    for (var i = 1; i <= 50; i++) {
        var clone = document.getElementById("tableRow0").cloneNode(true);
        clone.setAttribute('id', 'tableRow' + i);
    
        clone.cells[0].setAttribute('id', 'price' + i);
        clone.cells[1].setAttribute('id', 'stops' + i);
        clone.cells[2].setAttribute('id', 'compCode' + i);
        clone.cells[3].setAttribute('id', 'date' + i);
    
        var priceField = clone.cells[0].innerText;
        var stopsField = clone.cells[1].innerText;
        clone.cells[0].innerText = parseInt(priceField) + i * 10 + " €";
        clone.cells[1].innerText = parseInt(stopsField) + i;
    
        // Just a selection of all rows to add letters in front of the 
        // comany code in order to check the sorting.
        if (i >= 0 && i <= 10) {
            clone.cells[2].innerText = 'ab' + clone.cells[2].innerText;
        } else if (i > 11 && i < 18) {
            clone.cells[2].innerText = 'cd' + clone.cells[2].innerText;
        } else {
            clone.cells[2].innerText = 'wz' + clone.cells[2].innerText;
        }
        
        tempData.push(clone);
    }
}

loadData();

const tablePageSize = 20;
let currentPage = 1;

function initTable(data) {
    var tbl = document.getElementById("tableBody");
    tbl.innerHTML = '';

    data.filter((row, index) => {
        let start = (currentPage - 1) * tablePageSize;
        let end = currentPage * tablePageSize;
        if (index >= start && index < end) {
            return true;
        }
    }).forEach((rec) => {
        tbl.appendChild(rec);
    })

    insertButtonsWhenNeeded();

}

initTable(tempData);

function insertButtonsWhenNeeded() {
    if (document.getElementById("buttonNext") == null) {
        if (tempData.length > 20) {
            var rowToAddButtons = document.getElementById("tableWrapper");

            var containerForButtons = document.createElement("div");
            containerForButtons.classList.add("buttonWrapper");

            var tableButtonNext = document.createElement("button");
            tableButtonNext.type = "button";
            tableButtonNext.setAttribute("id", "buttonNext")
            tableButtonNext.innerHTML = ">";
    
            var tableButtonPrevious = document.createElement("button");
            tableButtonPrevious.type = "button";
            tableButtonPrevious.setAttribute("id", "buttonPrevious")
            tableButtonPrevious.innerHTML = "<";

            containerForButtons.appendChild(tableButtonPrevious);
            containerForButtons.appendChild(tableButtonNext);

            rowToAddButtons.appendChild(containerForButtons);

            document.querySelector('#buttonNext')
                .addEventListener('click', nextPage, false);
            document.querySelector('#buttonPrevious')
                .addEventListener('click', previousPage, false);
        }
    }
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
    }
    initTable(tempData);
  }
  
  function nextPage() {
    if ((currentPage * tablePageSize) < tempData.length) {
        currentPage++;
    }
    initTable(tempData);
  }

function rotateIcon(el, secondTime) {
    el.firstElementChild.style.display = 'inline';
    if (secondTime) {
        el.firstElementChild.innerText="▲";
    } else {
        el.firstElementChild.innerText="▼";
    }
}

function resetIcons() {
    table.querySelectorAll('th').forEach((headerElement) => {
       headerElement.firstElementChild.style.display = 'none';
    })
}

table.querySelectorAll('th').forEach((headerElement, columnNum) => {
    var secondTime = false;
    headerElement.addEventListener('click', event => {
        resetIcons();
        sortTable(table, columnNum, secondTime);
        rotateIcon(headerElement, secondTime);
        secondTime = (secondTime ? false : true);
        
    })
})

function sortTable(table, sortCol, secondTime) {
    const tableBody = table.querySelector('tbody');
    const tableData = getTableDataFromBody(tableBody);
    tableData.sort((a, b) => {
        if ((secondTime ? a[sortCol] > b[sortCol] : a[sortCol] < b[sortCol])) {
            return 1;
        }
        return -1;

    })
    setDataToTableBody(tableBody, tableData);
}

function getTableDataFromBody(tableBody) {
    const tableData = [];
    tableBody.querySelectorAll('tr').forEach(row => {
        const rowData = [];
        row.querySelectorAll('td').forEach(cell => {
            rowData.push(cell.innerText);
        })
        tableData.push(rowData);
    })
    return tableData;
}

function setDataToTableBody(tableBody, tableData) {
    tableBody.querySelectorAll('tr').forEach((row, i) => {
        const rowData = tableData[i];
        row.querySelectorAll('td').forEach((cell, j) => {
            cell.innerText = rowData[j];
        })
    });
}

function getTodayDate() {
    var today = new Date();

    var day = today.getDate();
    var month = today.getMonth()+1;
    var year = today.getFullYear(); 

    if (day < 10) {
        day = '0' + day;
    }

    if (month < 10) {
        month = '0' + month;
    }

    return year + '-' + month + '-' + day;
}

function setMinDateToDatePicker() {
    var datepicker = document.getElementById("departDate");
    datepicker.setAttribute('min', getTodayDate());
    datepicker.setAttribute('value', getTodayDate());
}

setMinDateToDatePicker();

var datesCounter = 0;

document.getElementById("addFlightBtn").addEventListener('click', function (evt) {
    if (!inputFieldsAreValid()) {
        return;
    }
    
    if (shouldAddFlight()) {
        addDateFlight();
    } else {
        blinkElement(document.querySelector(".dateCounter"));
    }
});

const maxDatesAllowed = 10;

document.getElementById("maxDatesAllowed").innerHTML = maxDatesAllowed;

function shouldAddFlight() {
    if (datesCounter < maxDatesAllowed) {
        return true;
    }
    return false;
}

function blinkElement(elem) {
    elem.classList.add("blinkable");
    setTimeout(function () {
        elem.classList.remove("blinkable");
    }, 500);
}

function setFlightCounterElement() {
    var dateCounterElem = document.getElementById("dateCounter");
    var cnt = parseInt(dateCounterElem.innerHTML);
    if (datesCounter - cnt <= 1) {
        dateCounterElem.innerHTML = datesCounter;
    }
}

function inputFieldsAreValid() {
    var isValid = true;
    document.querySelectorAll(".innerInputItemWrapper > label + input").forEach((el) => {
        if (el.value == "") {
            blinkElement(el);
            isValid = false;
        }
        return isValid;
    }); 

    return isValid;
}

var flightMapList = [];

var deleteTooltip = document.createElement("span");
deleteTooltip.innerHTML = "Remove";
deleteTooltip.classList.add("tooltipText");

function addDateFlight() {
    var flightMap = {};

    var datepicker = document.getElementById("departDate");
    var selectedDate = datepicker.value;

    if (!isValidDate(selectedDate)) {
        blinkElement(datepicker);
        return;
    }

    datesCounter++;
    var fromText = document.querySelector("#fromText").value;
    var toText = document.querySelector("#toText").value;
    
    var dateLabel = document.createElement("label");
    dateLabel.classList.add("innerInputItemWrapper");
    dateLabel.classList.add("fullBorder");
    dateLabel.classList.add("tooltipContainer");

    // dateLabel.classList.add("tooltipContainer");

    flightMap['departure'] = fromText;
    flightMap['arrival'] = toText;
    flightMap['date'] = selectedDate;

    dateLabel.innerHTML = formatMap(flightMap);

    if (flightMapList.length <= 0) {
        var dateRow = document.createElement("div");
        dateRow.classList.add("allInputItemsWrapper");
        dateRow.setAttribute('id', 'dateRow')

        var elemToAddRow = document.querySelector(".columnWrapper");
        
        elemToAddRow.appendChild(dateRow);
    } 

    var elemToAddRow = document.querySelector("#dateRow");

    //on click listener to delete the element from tree and list
    dateLabel.addEventListener('click', function (evt) {
        removeElementFromTree(evt.target);

        if (datesCounter >= 0) {
            datesCounter--;
        }

        setFlightCounterElement();
        var elemIndex = getElemIndexFromList(flightMapList, evt.target);
        if (elemIndex != -1) {
            flightMapList.splice(elemIndex, 1);
        }

        removeElemIfListIsEmpty(flightMapList, elemToAddRow);
    });

    
    elemToAddRow.appendChild(dateLabel);
    elemToAddRow.appendChild(deleteTooltip);
    
    setFlightCounterElement();

    flightMapList.push(flightMap);
}

function isValidDate(date) {
    if (date < getTodayDate()) {
        return false;
    }
    return true;
}

function removeElementFromTree(trg) {
    trg.remove();
}

function getElemIndexFromList(list, elem) {
    for (var i = 0; i <= list.length; i++) {
        if (formatMap(list[i]) == elem.innerText) {
            return i;
        }
    }
    return -1;
}

function formatMap(map) {
    return map['departure'] + " -> " + map['arrival'] + "  " + map['date'];
}

function removeElemIfListIsEmpty(list, wrapper) {
    if (list.length == 0) {
        wrapper.remove();
    }
}