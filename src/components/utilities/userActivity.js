// import { useRouter } from "vue-router";

let inactivityTimeout;

export function resetInactivityTimer() {
  clearTimeout(inactivityTimeout);
  //   inactivityTimeout = setTimeout(logoutUser, 10 * 60 * 1000); // 10 minutes
  inactivityTimeout = setTimeout(logoutUser, 3000); // 3 seconds
}

function logoutUser() {
  // Perform logout logic here (e.g., clear user data, redirect to login)
  sessionStorage.removeItem("user"); // Clear user data
  // Access the router within the function
  window.location.href = '/auth/login';// Redirect to the login page
}

// Add an event listener to reset the timer on user activity
window.addEventListener("mousemove", resetInactivityTimer);
window.addEventListener("keydown", resetInactivityTimer);

// Initialize the timer when the app loads or when the user logs in
resetInactivityTimer();
