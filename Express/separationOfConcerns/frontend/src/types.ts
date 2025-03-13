// types.ts - Contains all shared interfaces

export interface Book { 
    id: string;
    title: string;
    author: string;
    description: string;
    genre: string;
    year: string;
    pages: string;
    price: number;
    image: string;
    publisher: string;
  }
  
  export interface CartItem extends Book {
    quantity: number;
  }
  
  export interface BookStats { 
    totalBooks: number;
    avgPages: number;
    oldestBook: number | null;
    uniqueGenres: number;
  }