

'use strict';
// Rest of your existing script.js code remains the same


const darkModeToggle = document.getElementById('darkmode-toggle');


darkModeToggle.addEventListener('change', () => {
  if (darkModeToggle.checked) {
    setMode('dark'); // Set dark mode when checked
  } else {
    setMode('light'); // Set light mode when unchecked
  }
})



function setMode(mode) {
  document.body.setAttribute('data-theme', mode);
  localStorage.setItem('userPref', mode);
  darkModeToggle.checked = (mode === 'dark');
}




function getUserPreference() {
  const userPref = localStorage.getItem('userPref');
  console.log("User Pref:", userPref || "unknown");

  if (userPref) {
    return userPref;
  }

  const browserPref = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  console.log("Browser Pref:", browserPref || "unknown");

  const osPref = browserPref || "light";
  console.log("OS Pref:", osPref || "unknown");

  return osPref;
}

function applyMode() {
  const mode = getUserPreference();
  document.body.setAttribute('data-theme', mode); // Set the initial theme
  darkModeToggle.checked = (mode === 'dark');
}


applyMode();


// print to the console. 
window.onload = () => {
  const userPref = localStorage.getItem('userPref') || 'unknown';
  const browserPref = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const osPref = browserPref || 'unknown';

  console.log(`User Pref: ${userPref}`);
  console.log(`Browser Pref: ${browserPref || 'unknown'}`);
  console.log(`OS Pref: ${osPref}`);
};





// Select the div elements for displaying logs and the new log form
const logsAreaDiv = document.getElementById('logsArea')
const newLogDiv = document.getElementById('newLog')

// Function to check the textarea content and toggle the visibility of the "Add Log" button
function toggleButtonVisibility() {
  const logText = document.getElementById('logText')
  const addLogButton = document.getElementById('addLogButton')
  const textEntered = logText.value.trim().length > 0

  // Show the button if there is text, hide it if there is none
  addLogButton.style.display = textEntered ? 'block' : 'none'
}

// Function to generate a unique ID for new logs
function generateUniqueId() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  const charactersLength = characters.length
  
  // Loop to generate a random 7-character string
  for (let i = 0; i < 7; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  
  return result
}

// Event listener to run code once the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  const logText = document.getElementById('logText')

  // Add event listener to the logText textarea to toggle button visibility on input
  logText.addEventListener('input', toggleButtonVisibility)

  // Initially hide the "Add Log" button if there is no text
  toggleButtonVisibility()

  // URL for fetching courses from the server
  const myApiUrl = '/api/v1/courses'

  // Fetch courses from the server
  axios.get(myApiUrl)
    .then(response => {
      // Populate the course dropdown with data from the server
      fillCourses(response.data)
    })
    .catch(error => {
      console.error('Error fetching courses:', error)
    })
})

// Function to populate the course dropdown with options
function fillCourses(courses) {
  const dropdown = document.getElementById('course')

  if (Array.isArray(courses) && courses.length > 0) {
    courses.forEach(course1 => {
      const option = document.createElement('option')
      option.value = course1.id 
      option.textContent = course1.display
      dropdown.appendChild(option)
    })
  }
}

// Event listener for changes in the course selection
document.addEventListener('DOMContentLoaded', function() {
  const UVUId = document.getElementById('UVIdDiv') // Select the UVU ID input div
  const UVUIdInput = document.getElementById('uvuId') // Select the UVU ID input field

  // Add event listener for when a course is selected
  document.getElementById('course').addEventListener('change', function() {
    const courseId = this.value

    if (courseId) {
      // Show the UVU ID input field when a course is selected
      UVUId.style.display = 'block'

      // If the UVU ID is already 8 digits long, fetch the logs immediately
      if (UVUIdInput.value.length === 8) {
        sendLogsRequest(UVUIdInput.value) // Trigger log fetch if UVU ID is valid
      }
    } else {
      // If "Choose Courses" is selected, clear the input and hide the logs
      UVUId.style.display = 'none'
      UVUIdInput.value = '' // Clear the input field
      logsAreaDiv.style.display = 'none'
      newLogDiv.style.display = 'none'
    }
  })

  // Add event listener for changes in the UVU ID input field
  UVUIdInput.addEventListener('input', function(event) {
    const value = event.target.value

    // Remove any non-digit characters from the input
    event.target.value = value.replace(/\D/g, '')

    // If the input reaches exactly 8 digits, trigger a log fetch
    if (event.target.value.length === 8) {
      sendLogsRequest(event.target.value)
    }
  })
})

// Function to send a request to the server to fetch logs for a specific course and UVU ID
function sendLogsRequest(inputValue) {
  const courseId = document.getElementById('course').value
  const forLogs = `/api/v1/logs?courseId=${courseId}&uvuId=${inputValue}`

  axios.get(forLogs)
  .then(response => {
    fillLogs(response.data, inputValue)
  })
  .catch(error => {
    console.error('Error fetching Data:', error)
  })

}

// Function to populate the logs area with the fetched logs
function fillLogs(logs, inputValue) {
  const logsList = logsAreaDiv.querySelector('ul[data-cy="logs"]')
  const uvuIdDisplay = document.getElementById('uvuIdDisplay')
  const listHide = document.getElementById('listHide')

  // Clear the previous logs
  logsList.innerHTML = ''

  // Show the logs area and new log form
  logsAreaDiv.style.display = 'block'
  newLogDiv.style.display = 'block'
  
  if (Array.isArray(logs) && logs.length > 0) {
    listHide.style.display = 'block'

    logs.forEach(data => {
      uvuIdDisplay.textContent = `Student Logs for ${data.uvuId}`
      
      const li = document.createElement('li')
      const dateDiv = document.createElement('div')
      const pre = document.createElement('pre')
      const p = document.createElement('p')
      const toggleIndicator = document.createElement('span')

      // Display the log date
      dateDiv.innerHTML = `<small>${data.date}</small>`
      p.textContent = data.text

      // Hide the log text initially
      p.style.display = 'none'

      toggleIndicator.textContent = '▶' 
      dateDiv.style.cursor = 'pointer' 
      toggleIndicator.style.marginRight = '10px'

      dateDiv.prepend(toggleIndicator)

      pre.appendChild(p)
      li.appendChild(dateDiv)
      li.appendChild(pre)
  
      // Add click event to toggle the visibility of the log text
      li.addEventListener('click', () => {
        const isHidden = p.style.display === 'none'
        p.style.display = isHidden ? 'block' : 'none'
        toggleIndicator.textContent = isHidden ? '▼' : '▶'
      })
  
      logsList.appendChild(li)
    })

  } else {
    // Hide the log list if no logs are found
    listHide.style.display = 'none'
    uvuIdDisplay.textContent = `No logs found for ${inputValue}`
  }
}

// Add event listener for the "Add Log" button
addLogButton.addEventListener('click', function(event) {
  event.preventDefault() // Prevent default form submission behavior
  const courseId = document.getElementById('course').value
  const logValue = logText.value.trim()
  const uvuId = document.getElementById('uvuId').value

  // Validate the input fields
  if (courseId && uvuId.length === 8 && logValue) {
    const postUrl = `/api/v1/logs`

    // Prepare the data for the new log entry
    const newLogData = {
      courseId: courseId,
      uvuId: uvuId,
      date: new Date().toLocaleString(),
      text: logValue,
      id: generateUniqueId() // Generate a unique ID for the log
    }

    // Send the new log entry to the server
    axios.post(postUrl, newLogData)
      .then(response => {
        console.log('Log updated successfully:', response.data)
        logText.value = '' // Clear the textarea
        toggleButtonVisibility() // Re-check button visibility
        sendLogsRequest(uvuId) // Refresh the logs display
      })
      .catch(error => {
        console.error('Error:', error)
      })

  } else {
    console.error('Invalid data. Ensure all fields are correctly filled.')
  }
})




