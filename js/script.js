let myLibrary = [];
const libraryTableBodyDiv = document.querySelector(".table-body");
const bookForm = document.getElementById("book-form");
let counter=0;

function Book(title, author, pages, read){
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
};

let addBookToLibrary = function(tempBook){
    myLibrary.push(tempBook);
    displayBooks();  
};

let getInput = function(){
    let title= bookForm.title.value;
    let author = bookForm.author.value;
    let pages = bookForm.pages.value;
    let read = bookForm.read.value;
    tempBook = new Book(title,author,pages,read)
    return (tempBook);
}
let clearLibraryBody = function (){
    libraryTableBodyDiv.innerHTML="";
};

let prepareLibraryItem = function (tempLibraryItemDiv, libraryItem){
    let title = libraryItem.title;
    let author = libraryItem.author;
    let pages = libraryItem.pages;
    let read = libraryItem.read;
    tempLibraryItemDiv.classList.add("library-body-item");
    tempLibraryItemDiv.id="test-"+counter;
    //Create a table data entry for title
    let tempData = document.createElement("td");
    tempData.classList.add("title");
    tempData.textContent=title;
    tempLibraryItemDiv.appendChild(tempData);
    //Create a table data entry for author
    tempData = document.createElement("td");
    tempData.classList.add("author");
    tempData.textContent=author;
    tempLibraryItemDiv.appendChild(tempData);
    //Create a table data entry for pages
    tempData = document.createElement("td");
    tempData.classList.add("pages");
    tempData.textContent=pages;
    tempLibraryItemDiv.appendChild(tempData);
    //Create a table data entry for read
    tempData = document.createElement("td");
    tempData.classList.add("read");
    //Checks to see if read is true or false then sets text content to yes or no
    if (read==true || read=="yes" ){
        tempData.textContent="Yes";
    }else if (read==false || read=="no") {
        tempData.textContent="No";
    }
    tempLibraryItemDiv.appendChild(tempData);
    //Create a remove button
    tempData = document.createElement("button");
    tempData.classList.add("remove-button");
    //Create a numbered list of buttons
    tempData.id="remove-button-"+counter;
    tempData.textContent="Remove";
    tempData.addEventListener('click', (e)=>{
        //delete the remove-button- part of the string to get the array location of table data
        let location = e.target.id.replace("remove-button-","");
        myLibrary.splice(location , 1);
        displayBooks();
    });
    tempLibraryItemDiv.appendChild(tempData);
    //Create a button to change read status
    tempData = document.createElement("button");
    tempData.classList.add("read-button");
    tempData.id="read-button-"+counter;
    tempData.textContent="Change Read status";
    tempData.addEventListener('click', (e)=>{
        //toggle the read status to true or false;
        let location = e.target.id.replace("read-button-","");
        if (myLibrary[location].read==true || myLibrary[location].read=="yes"){
            myLibrary[location].read=false;
        } else{
            myLibrary[location].read=true;
        }
        displayBooks();
    });
    tempLibraryItemDiv.appendChild(tempData);
    //Increase counter used for indexing 
    counter++;
    return tempLibraryItemDiv;
};

let displayBooks = function (){
    //Clears all of the table data before going through the array and creating the updated table
    clearLibraryBody();
    //This goes through each element of the myLibrary array and creates data entries in the table for each.
    myLibrary.forEach((libraryItem)=>{
        let tempLibraryItemDiv = document.createElement("tr");
        //Prepares the table data entry
        tempLibraryItemDiv = prepareLibraryItem(tempLibraryItemDiv, libraryItem);
        //Outputs the prepared table to the display
        libraryTableBodyDiv.appendChild(tempLibraryItemDiv);
    });
    counter=0;
};