import { Response } from "express";
import pool from "../db/db.config";
import { UserRequest } from "../utils/types/userTypes";
import asyncHandler from "../middlewares/asyncHandler";
import { BookRequest} from "@app/utils/types/bookTypes";
/**
 * @desc Create an event
 * @route POST /api/v1/events
 * @access Organizer Only
 */
export const createBook = asyncHandler(async (req: UserRequest, res: Response) => {
    //Modify the createEvent function inside eventController.ts so that user_id is dynamically obtained from the logged-in user.
    //     ✅ Now, user_id is automatically set from the token instead of being manually provided.
    // ✅ Ensures only Organizer or Admin roles can create events.
    try {
        // Extract user_id from the authenticated user's token
        if (!req.user) {
            res.status(401).json({ message: "Not authorized" });
            return;
        }

        const user_id = req.user.user_id; // User ID from token
        const { title, author, genre, year, pages, publisher, description, image,  price } = req.body;

        // Ensure that only an Organizer or the Adim can create an event
    
        if (req.user.role_name !== "Librarian" && req.user.role_name !== "Admin") {
            res.status(403).json({ message: "Access denied: Only Organizers or Admins can create books" });
            return;
        }

        // Insert book into the database
    

        const bookResult = await pool.query(
          `INSERT INTO books (title, author, genre, year, pages, publisher, description, image, created_by, price) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
          [title, author, genre, year, pages, publisher, description, image,user_id, price]
        );

        res.status(201).json({
            message: "Event created successfully",
            event: bookResult.rows[0]
        });

    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Get all events (Public - Attendees, Organizers, Admins)
export const getBooks = asyncHandler(async (req: BookRequest, res: Response) => {
    const result = await pool.query("SELECT * FROM books ORDER BY created_at ASC");
    res.status(200).json(result.rows);
});

// Get single event by ID (Public - Attendees, Organizers, Admins)
export const getBookById = asyncHandler(async (req: BookRequest, res: Response) => {
    const { id } = req.params;

    const result = await pool.query("SELECT * FROM books WHERE book_id=$1", [id]);

    if (result.rows.length === 0) {
        res.status(404).json({ message: "Event not found" });
        return;
    }

    res.status(200).json(result.rows[0]);
});

// Update event (Only the event owner or Admin)
export const updateBook = asyncHandler(async (req: BookRequest, res: Response) => {
    const { id } = req.params;
    const { title, author, genre, year, pages, publisher, description, image, price } = req.body;

    if (!req.user) {
        res.status(401).json({ message: "Not authorized" });
        return;
    }

    // Check if the book exists
    const bookQuery = await pool.query("SELECT created_by FROM books WHERE book_id=$1", [id]);

    if (bookQuery.rows.length === 0) {
        res.status(404).json({ message: "Book not found" });
        return;
    }

    // Check if the user is the owner or an Admin
    if (bookQuery.rows[0].created_by !== req.user.user_id && req.user.role_name !== "Admin") {
        res.status(403).json({ message: "Not authorized to update this event" });
        return;
    }

    // Update book
    const result = await pool.query(
        "UPDATE books SET title=$1, author=$2, genre=$3, year=$4, pages=$5, publisher=$6, description=$7, image=$8, price=$9, updated_at=NOW() WHERE book_id=$10 RETURNING *",
        [title, author, genre, year, pages, publisher, description, image, price, id]
      );

    res.json({ message: "Book updated", book: result.rows[0] });
});

// Delete book (Only the book owner or Admin)
export const deleteBook = asyncHandler(async (req: BookRequest, res: Response) => {
    const { id } = req.params;

    if (!req.user) {
        res.status(401).json({ message: "Not authorized" });
        return;
    }

    // Check if the book exists
    const bookQuery = await pool.query("SELECT created_by FROM books WHERE book_id=$1", [id]);

    if (bookQuery.rows.length === 0) {
        res.status(404).json({ message: "Book not found" });
        return;
    }

    // Check if the user is the owner or an Admin
    if (bookQuery.rows[0].created_by !== req.user.user_id && req.user.role_name !== "Admin") {
        res.status(403).json({ message: "Not authorized to delete this event" });
        return;
    }

    // Delete book
    await pool.query("DELETE FROM books WHERE book_id=$1", [id]);
    res.json({ message: "Book deleted successfully" });
});
