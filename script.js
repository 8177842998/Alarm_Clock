// Initial References
let timerRef = document.querySelector(".timer-display");
const hourInput = document.getElementById("hourInput");
const minuteInput = document.getElementById("minuteInput");
const secondInput = document.getElementById("secondInput");

let activeAlarms = document.querySelector(".activeAlarms");
const setAlarm = document.getElementById("set");
let alarmsArray = [];
let alarmSound = new Audio("./alarm.mp3");

let selectElement = document.getElementById("ampm");

let initialHour = 0,
  initialMinute = 0,
  initialsec=0,
  alarmIndex = 0;

// Append zeroes for single digit
const appendZero = (value) => (value < 10 ? "0" + value : value);

// Search for value in object
const searchObject = (parameter, value) => {
  let alarmObject,
    objIndex,
    exists = false;
  alarmsArray.forEach((alarm, index) => {
    if (alarm[parameter] == value) {
      exists = true;
      alarmObject = alarm;
      objIndex = index;
      return false;
    }
  });
  return [exists, alarmObject, objIndex];
};

// Display Time
function displayTimer() {
  let date = new Date();
  let [hours, minutes, seconds] = [
    appendZero(date.getHours()),
    appendZero(date.getMinutes()),
    appendZero(date.getSeconds()),
  ];

  // Display time
  let ampm = selectElement.value;
  if (hours > 12) {
    hours -= 12;
    ampm = "PM";
  } else if (hours === "00") {
    hours = 12;
    ampm = "AM";
  } else if (hours === "12") {
    ampm = "PM";
  } else {
    ampm = "AM";
  }

  timerRef.innerHTML = `${hours}:${minutes}:${seconds} ${ampm}`;

  // Alarm
  alarmsArray.forEach((alarm, index) => {
    // console.log("got inside");
    if (alarm.isActive) {

      if (
        `${alarm.alarmHour}:${alarm.alarmMinute}:${alarm.alarmsec}` === `${hours}:${minutes}:${seconds}`
        // alarm.ampm === ampm
      ) {
        // Show alert message
        // console.log("got inside");
        alert("This is an alert message!");
      }
    }
  });
}

const inputCheck = (inputValue) => {
  inputValue = parseInt(inputValue);
  if (inputValue < 10) {
    inputValue = appendZero(inputValue);
  }
  return inputValue;
};

hourInput.addEventListener("input", () => {
  hourInput.value = inputCheck(hourInput.value);
});

minuteInput.addEventListener("input", () => {
  minuteInput.value = inputCheck(minuteInput.value);
});

secondInput.addEventListener("input", () => {
  secondInput.value = inputCheck(secondInput.value);
});

// Create alarm div
const createAlarm = (alarmObj) => {
  const { id, alarmHour, alarmMinute, alarmSecond, ampm } = alarmObj;

  let alarmDiv = document.createElement("div");
  alarmDiv.classList.add("alarm");
  alarmDiv.setAttribute("data-id", id);
  alarmDiv.innerHTML = `<span>${alarmHour}:${alarmMinute}:${alarmSecond} ${ampm}</span>`;

  let checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.addEventListener("click", (e) => {
    if (e.target.checked) {
      startAlarm(e);
    } else {
      stopAlarm(e);
    }
  });
  alarmDiv.appendChild(checkbox);

  let deleteButton = document.createElement("button");
  deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
  deleteButton.classList.add("deleteButton");
  deleteButton.addEventListener("click", (e) => deleteAlarm(e));
  alarmDiv.appendChild(deleteButton);
  activeAlarms.appendChild(alarmDiv);
};

// Set Alarm
setAlarm.addEventListener("click", () => {
  alarmIndex += 1;

  let alarmObj = {};
  alarmObj.id = `${alarmIndex}_${hourInput.value}_${minuteInput.value}_${secondInput.value}`;
  alarmObj.alarmHour = hourInput.value;
  alarmObj.alarmMinute = minuteInput.value;
  alarmObj.alarmSecond = secondInput.value;
  alarmObj.ampm = selectElement.value;
  alarmObj.isActive = false;

  alarmsArray.push(alarmObj);
  createAlarm(alarmObj);
  hourInput.value = appendZero(initialHour);
  minuteInput.value = appendZero(initialMinute);
  secondInput.value = appendZero(initialSecond);
});

// Start Alarm
const startAlarm = (e) => {
  let searchId = e.target.parentElement.getAttribute("data-id");
  let [exists, obj, index] = searchObject("id", searchId);
  if (exists) {
    alarmsArray[index].isActive = true;
  }
};

// Stop alarm
const stopAlarm = (e) => {
  let searchId = e.target.parentElement.getAttribute("data-id");
  let [exists, obj, index] = searchObject("id", searchId);
  if (exists) {
    alarmsArray[index].isActive = false;
  }
};

// Delete alarm
const deleteAlarm = (e) => {
  let searchId = e.target.parentElement.parentElement.getAttribute("data-id");
  let [exists, obj, index] = searchObject("id", searchId);
  if (exists) {
    e.target.parentElement.parentElement.remove();
    alarmsArray.splice(index, 1);
  }
};

window.onload = () => {
  setInterval(displayTimer);
  initialHour = 0;
  initialMinute = 0;
  initialSecond = 0;
  alarmIndex = 0;
  alarmsArray = [];
  hourInput.value = appendZero(initialHour);
  minuteInput.value = appendZero(initialMinute);
  secondInput.value = appendZero(initialSecond);
};

