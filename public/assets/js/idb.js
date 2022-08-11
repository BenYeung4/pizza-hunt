//indexedDB file to handle all indexedDB funcationlality for the app
//create variables to hold db connection that will store object when the connectino is complete
let db;

//after database (db) has been created, establish a connection to IndexedDB database called 'pizza_hunt' and set it to version 1
//event listener is indexedDB.open(), indexedDB is a global veriable, .open() takes two variable
//pizza_hunt is the name of the database we create or connect to(if it does exist)
//1 is the version of the database.  this parameter is used to determine wheter the database's structure has changed between connections. ex. when changing the columns of a SQL database
const request = indexedDB.open("pizza_hunt", 1);

//this event will emit if the database versino changes(nonexistant to version 1, v1 to v2, etc.)
//since IndexedDB database doesnt' hold the data, the container that stores the data is called an object store.  can only be created until the connection to the database is open, which is the request variable above
//event wont run again unless we delete the database from the browser or we change the version number in the indexedDB.open() from a "1" to a different number or "version"
request.onupgradeneeded = function (event) {
  //save a reference to the database
  const db = event.target.result;
  //create an object store(table) called `new_pizza`, set it to have an auto incrementing priamry key of sorts
  //when create the "new_pizza" object store, we also instruct that store to have an auto incrementing index for each enw set of data we insert.
  db.createObjectStore("new_pizza", { autoIncrement: true });
};

// upon a successful. we set it up so that when we finalize the connectino to the database, we can store the resulting database obejct to the global variable db we created earlier.  this event will also emit everytime we interact with the database, so everytime it runs we hec to see if the app is connectd to the internet network.
request.onsuccess = function (event) {
  // when db is successfully created with its object store (from onupgradedneeded event above) or simply established a connection, save reference to db in global variable
  db = event.target.result;

  // check if app is online, if yes run uploadPizza() function to send all local db data to api
  //if conected to internet, then will do the uploadPizza() function
  if (navigator.onLine) {
    //this is to see if we're online everyime this app opens and upload any remnant pizza data
    uploadPizza();
  }
};

request.onerror = function (event) {
  // log error here
  console.log(event.target.errorCode);
};

// This function will be executed if we attempt to submit a new pizza and there's no internet connection
function saveRecord(record) {
  // open a new transaction with the database with read and write permissions
  const transaction = db.transaction(["new_pizza"], "readwrite");

  // access the object store for `new_pizza`
  const pizzaObjectStore = transaction.objectStore("new_pizza");

  // add record to your store with add method
  pizzaObjectStore.add(record);
}

//when we retrieve our internet again, the database is
function uploadPizza() {
  // open a transaction on your db
  const transaction = db.transaction(["new_pizza"], "readwrite");

  // access your object store
  const pizzaObjectStore = transaction.objectStore("new_pizza");

  // get all records from store and set to a variable
  const getAll = pizzaObjectStore.getAll();

  // upon a successful .getAll() execution, run this function
  //with the above getAll variable, it will have a .result proerty thats an array of all the data we retireved from the new_pizza object store
  getAll.onsuccess = function () {
    // if there was data in indexedDb's store, let's send it to the api server, sending to POST /api/pizzas
    if (getAll.result.length > 0) {
      fetch("/api/pizzas", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((serverResponse) => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }
          // open one more transaction
          const transaction = db.transaction(["new_pizza"], "readwrite");
          // access the new_pizza object store
          const pizzaObjectStore = transaction.objectStore("new_pizza");
          // clear all items in your store
          pizzaObjectStore.clear();

          alert("All saved pizza has been submitted!");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
}

//listen for app coming back online
window.addEventListener("online", uploadPizza);
