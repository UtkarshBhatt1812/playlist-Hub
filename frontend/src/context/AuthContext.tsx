import { createContext,useContext,useState,useEffect } from "react";

interface User {
    id: string;
    name: string;
    email: string;
    role : 'user'  | 'admin';
}

interface AuthContextType{
    user : User | null;
    token : string| null;
}