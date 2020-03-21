let myLibrary = [];

function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}

function book(title, author, pages, read) {
    this.title = title
    this.author = author
    this.pages = pages
    this.read = read

    this.info = function() {
        return `${title} by ${author}, ${pages} pages, ${read}`;
    }

    this.haveRead = function() {
        this.read = this.read == "Read" ? this.read = "Not Read" : this.read = "Read";
    }
}

function addBookToLibrary(title, author, pages, read) {
    let newBook = new book(title, author, pages, read);
    myLibrary.push(newBook);

    if (storageAvailable('localStorage')) {
        updateLocalStorage();
    }
}

function updateLocalStorage() {
    localStorage.setItem("myLocalStorageLibrary", myLibrary);
}

function loadLocalStorage() {
    localStorage.getItem("myLocalStorageLibrary");
}

function createCardContainer() {
    let container = document.createElement("div");
    container.id = "cardContainer";
    document.body.append(container);
}

function render() {
    let template = "";

    for (let [i, obj] of myLibrary.entries()) {
        template += `
            <div class="card" id="card${i}">
                <p class="title">${obj.title}</p>
                <p class="author">by ${obj.author}</p>
                <p class="pages">Pages: ${obj.pages}</p>
                <button class="readStatus" data-index="${i}">${obj.read}</button>
                <button class="removeBook" id="removeBook${i}" data-index="${i}">Remove</button>
            </div>
            `;
    }

    cardContainer.innerHTML = template;

    //remove button logic
    let removeButtons = document.querySelectorAll(".removeBook")
    removeButtons.forEach((button) => {
        button.addEventListener("click", function(e) {
            removeBook(e.target.dataset.index);
        });
    })

    //change read status logic
    let changeReadButtons = document.querySelectorAll(".readStatus");
    changeReadButtons.forEach((button) => {
        button.addEventListener("click", function(e) {
            myLibrary[(e.target.dataset.index)].haveRead();
            render();
            changeReadButtonColor(e.target.dataset.index);
        })
    });
};

function form() {
    let template = `
        <form id="form">
            <h2>Add New Book:</h2>
            <input class="forminputs" id="formtitle" name="title" placeholder="Title" type="text">
            <input class="forminputs" id="formauthor" name="author" placeholder="Author" type="text">
            <input class="forminputs" id="formpages" name="pages" placeholder="Number of pages" type="text">
            <input class="forminputs" id="formread" name="read" placeholder="Have you read it?" type="text">
            <div class="formbuttons">
                <button type="button" id="addbutton">Add</button>
                <button type="reset" id="closebutton">Close</button>
            </div>
        </form>
        `
    let container = document.createElement("div");
    container.id = "formContainer";
    container.innerHTML = template;
    document.body.append(container);
}

function openForm() {
    document.getElementById("formContainer").style.display = "block";
}
  
function closeForm() {
    document.getElementById("formContainer").style.display = "none";
}

function removeBook(index) {
    //remove from myLibrary
    myLibrary.splice(index, 1);

    //remove from html
    let bookToRemove = document.getElementById(`card${index}`);
    bookToRemove.parentNode.removeChild(bookToRemove);
}

function changeReadButtonColor(index) {
    let readButtons = document.getElementsByClassName("readStatus");
    if (readButtons[index].innerHTML == "Read") {
        readButtons[index].style.background = "#88B04B";
    }
    else {
        readButtons[index].style.background = "#FE5F55";
    }
}

//load library from local storage if it exists
try {
    loadLocalStorage();
} catch (error) {
    console.log(err.message);
}

//create 'add new book' button
let newbookbtn = document.createElement("button");
newbookbtn.id = "addnewbookbutton"
newbookbtn.innerText = "Add New Book";
document.body.append(newbookbtn);
newbookbtn.addEventListener("click", openForm);

//create card container
createCardContainer();

//example books
addBookToLibrary("Animal Farm", "George Orwell", 122, "Read");
addBookToLibrary("The Little Prince", "Antoine de Saint-Exupéry", 93, "Not Read");
addBookToLibrary("Elevation", "Stephen King", 146, "Read");

//display books from myLibrary
render();

//create add book form
form();

//form add button
document.getElementById("addbutton").addEventListener("click", function(e) {
    ////check if values are empty/form validation?///
    addBookToLibrary(formtitle.value, formauthor.value, formpages.value, formread.value);
    document.getElementById("closebutton").click();
    render();
})

//form close button
closebutton.addEventListener("click", closeForm);