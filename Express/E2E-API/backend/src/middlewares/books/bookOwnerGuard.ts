import { Response, NextFunction } from "express";
import asyncHandler from "../asyncHandler";
import pool from "../../db/db.config";
import { BookRequest } from "../../utils/types/bookTypes";

// Ensures user can only modify their own events
export const bookOwnerGuard = asyncHandler(async (req: BookRequest, res: Response, next: NextFunction) => {
    const { id: bookId } = req.params;

    if (!req.user) {
        res.status(401).json({ message: "Not authorized" });
        return;
    }

    // Check if the user is the owner of the event
    const bookQuery = await pool.query(
        "SELECT created_by FROM books WHERE book_id = $1",
        [bookId]
    );

    if (bookQuery.rows.length === 0) {
        res.status(404).json({ message: "Event not found" });
        return;
    }

    if (bookQuery.rows[0].created_by !== req.user.user_id) {
        res.status(403).json({ message: "Not authorized to edit this event" });
        return;
    }

    // Attach event details to request
    req.book = {
        book_id: bookQuery.rows[0].id,
        title: bookQuery.rows[0].title,
        author: bookQuery.rows[0].author,
        genre: bookQuery.rows[0].genre,
        year: bookQuery.rows[0].year,
        pages: bookQuery.rows[0].pages,
        publisher: bookQuery.rows[0].publisher,
        description: bookQuery.rows[0].description,
        image: bookQuery.rows[0].image,
        price: bookQuery.rows[0].price,
        total_copies: bookQuery.rows[0].total_copies,
        available_copies: bookQuery.rows[0].available_copies,
        borrower_id: bookQuery.rows[0].borrower_id,
        created_at: bookQuery.rows[0].created_at,
        updated_at: bookQuery.rows[0].updated_at
    };

    next();
});

