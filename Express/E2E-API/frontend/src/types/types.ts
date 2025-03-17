// types/types.ts
export interface Book {
    book_id?: string;
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