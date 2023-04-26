// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCEJYensk9gMjI8_dqrNo5WzIUYFAkrfvk",
  authDomain: "movie-review-8f4b1.firebaseapp.com",
  databaseURL: "https://movie-review-8f4b1-default-rtdb.firebaseio.com",
  projectId: "movie-review-8f4b1",
  storageBucket: "movie-review-8f4b1.appspot.com",
  messagingSenderId: "165421734999",
  appId: "1:165421734999:web:3405cf6ac2167c540ad712"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Reference to movie review data in the database
var MovieReviewDB = firebase.database().ref('moviewReview');

// Retrieve data from the database
MovieReviewDB.on('value', function(snapshot) {
  var tableBody = document.getElementById('review-table').getElementsByTagName('tbody')[0];
  tableBody.innerHTML = ""; // clear the table body before adding new data
  snapshot.forEach(function(childSnapshot, key) {
    var data = childSnapshot.val();
    var row = tableBody.insertRow(); // create a new row in the table
    row.insertCell().innerHTML = data.name; // add movie name to the row
    row.insertCell().innerHTML = data.rating; // add movie rating to the row
    row.insertCell().innerHTML = data.dir_name; // add movie director to the row
    row.insertCell().innerHTML = data.date; // add movie release date to the row
    row.insertCell().innerHTML = `<button type="button" onclick="EditReview('${childSnapshot.key}')">Edit</button>`; // add delete button to the row
    row.insertCell().innerHTML = `<button type="button" onclick="deleteReview('${childSnapshot.key}')">delete</button>`;
  });
});

// Add submit event listener to the review form
document.getElementById('review-form').addEventListener('submit', submitForm);

// Function to handle the form submission
function submitForm(e){
  e.preventDefault();

  // Get input values from the form
  var name = getElementval('name');
  var rating = getElementval('rating');
  var dir_name = getElementval('dir_name');
  var date = getElementval('date');

  // Save the input values to the database
  saveDetail(name,rating,dir_name,date);

  // Display the alert message
  document.querySelector(".alert").style.display = "block";

  // Hide the alert message after 1 second
  setTimeout(function(){
    document.querySelector(".alert").style.display = "none";
  }, 1000);

  // Reset the form
  document.getElementById('review-form').reset();
}

// Function to save input values to the database
const saveDetail = (name, rating, dir_name,date) =>{
  var newMovieReview = MovieReviewDB.push();
  newMovieReview.set({
    name: name,
    rating: rating,
    dir_name: dir_name,
    date: date,
  });
};

// Function to get input value by element id
const getElementval = (id)=>{
  return document.getElementById(id).value;
};
// Function to handle editing of review
function EditReview(key){
  // Get reference to the movie review to be edited
  var movieReviewToEdit = firebase.database().ref('moviewReview/' + key);

  // Retrieve the data from the database
  movieReviewToEdit.once('value').then(function(snapshot) {
    var data = snapshot.val();

    // Populate the form fields with the retrieved data
    document.getElementById('name').value = data.name;
    document.getElementById('rating').value = data.rating;
    document.getElementById('dir_name').value = data.dir_name;
    document.getElementById('date').value = data.date;

    // Change the submit button to an update button
    document.getElementById('submit-btn').value = "Update";

    // Update the database when the update button is clicked
    document.getElementById('submit-btn').onclick = function() {
      movieReviewToEdit.update({
        name: getElementval('name'),
        rating: getElementval('rating'),
        dir_name: getElementval('dir_name'),
        date: getElementval('date'),
      });

      // Reset the form and change the submit button back to its original text
      document.getElementById('review-form').reset();
      document.getElementById('submit-btn').value = "Submit";
    }
  });
}


//Function to handle deleting a review
function deleteReview(key) {
  firebase.database().ref('moviewReview/' + key).remove();
}