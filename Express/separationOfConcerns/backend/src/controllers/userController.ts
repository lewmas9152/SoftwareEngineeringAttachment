import { Request, Response } from 'express';
import pool from '../db/db.config';
import bcrypt from 'bcrypt';

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT u.user_id, u.name, u.email, r.role_name 
      FROM users u
      JOIN user_roles r ON u.role_id = r.role_id
      ORDER BY u.user_id ASC
    `);
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      SELECT u.user_id, u.name, u.email, r.role_name 
      FROM users u
      JOIN user_roles r ON u.role_id = r.role_id
      WHERE u.user_id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create a new user
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role_id } = req.body;
    
    // Validate required fields
    if (!name || !email || !password || !role_id) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    // Check if email already exists
    const emailCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ message: "Email already in use" });
    }
    
    // Check if role exists
    const roleCheck = await pool.query("SELECT * FROM user_roles WHERE role_id = $1", [role_id]);
    if (roleCheck.rows.length === 0) {
      return res.status(400).json({ message: "Invalid role" });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Insert user
    const result = await pool.query(
      "INSERT INTO users (name, email, password, role_id) VALUES ($1, $2, $3, $4) RETURNING user_id, name, email, role_id",
      [name, email, hashedPassword, role_id]
    );
    
    res.status(201).json({
      message: "User created successfully",
      user: result.rows[0]
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update user
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, password, role_id } = req.body;
    
    // Check if user exists
    const userCheck = await pool.query("SELECT * FROM users WHERE user_id = $1", [id]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // If email is changing, check if the new email is already in use
    if (email && email !== userCheck.rows[0].email) {
      const emailCheck = await pool.query("SELECT * FROM users WHERE email = $1 AND user_id != $2", [email, id]);
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }
    
    // If role is changing, check if the new role exists
    if (role_id) {
      const roleCheck = await pool.query("SELECT * FROM user_roles WHERE role_id = $1", [role_id]);
      if (roleCheck.rows.length === 0) {
        return res.status(400).json({ message: "Invalid role" });
      }
    }
    
    // Build update query dynamically based on provided fields
    let updateFields = [];
    let queryParams = [];
    let paramIndex = 1;
    
    if (name) {
      updateFields.push(`name = $${paramIndex}`);
      queryParams.push(name);
      paramIndex++;
    }
    
    if (email) {
      updateFields.push(`email = $${paramIndex}`);
      queryParams.push(email);
      paramIndex++;
    }
    
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateFields.push(`password = $${paramIndex}`);
      queryParams.push(hashedPassword);
      paramIndex++;
    }
    
    if (role_id) {
      updateFields.push(`role_id = $${paramIndex}`);
      queryParams.push(role_id);
      paramIndex++;
    }
    
    // If no fields to update
    if (updateFields.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }
    
    // Add the user_id as the last parameter
    queryParams.push(id);
    
    // Execute update query
    const result = await pool.query(
      `UPDATE users SET ${updateFields.join(', ')} WHERE user_id = $${paramIndex} RETURNING user_id, name, email, role_id`,
      queryParams
    );
    
    res.status(200).json({
      message: "User updated successfully",
      user: result.rows[0]
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Check if user exists
    const userCheck = await pool.query("SELECT * FROM users WHERE user_id = $1", [id]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Delete user
    await pool.query("DELETE FROM users WHERE user_id = $1", [id]);
    
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};