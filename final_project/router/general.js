const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(404).json({ message: "Username and password are required" });
    }
    const userExists = users.find((user) => user.username === username);
    if (userExists) {
        return res.status(409).json({ message: "Username already exists!" });
    }
    users.push({ "username": username, "password": password });
    return res.status(201).json({ message: "User successfully registered. Now you can login" });
});

// Task 10: Get the book list available in the shop using Async-Await with Axios
public_users.get('/', async function (req, res) {
    try {
        // Simulating an asynchronous fetch of the books object
        const getBooks = () => Promise.resolve(books);
        const bookList = await getBooks();
        return res.status(200).send(JSON.stringify(bookList, null, 4));
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving books" });
    }
});

// Task 11: Get book details based on ISBN using Promises/Axios
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const getBookByISBN = new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) resolve(book);
        else reject({ status: 404, message: "Book not found" });
    });

    getBookByISBN
        .then((book) => res.status(200).json(book))
        .catch((err) => res.status(err.status).json({ message: err.message }));
});

// Task 12: Get book details based on author using Async-Await
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const getBooksByAuthor = () => {
            return new Promise((resolve) => {
                const filteredBooks = Object.values(books).filter(b => b.author === author);
                resolve(filteredBooks);
            });
        };
        const results = await getBooksByAuthor();
        if (results.length > 0) {
            return res.status(200).json(results);
        } else {
            return res.status(404).json({ message: "Author not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// Task 13: Get all books based on title using Async-Await
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        const getBooksByTitle = () => {
            return new Promise((resolve) => {
                const filteredBooks = Object.values(books).filter(b => b.title === title);
                resolve(filteredBooks);
            });
        };
        const results = await getBooksByTitle();
        if (results.length > 0) {
            return res.status(200).json(results);
        } else {
            return res.status(404).json({ message: "Title not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).json({ message: "No reviews found for this ISBN" });
    }
});

module.exports.general = public_users;
