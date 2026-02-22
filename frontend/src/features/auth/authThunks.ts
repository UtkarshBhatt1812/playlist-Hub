import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";

export const loginUser = createAsyncThunk("auth/login",async(credentials : {email:string,password:string})=>{
    const response = await api.post("/auth/login",credentials);
    return response.data;
})
export const registerUser = createAsyncThunk("auth/register",async(userData : {name:string,email:string,password:string})=>{
    const response = await api.post("/auth/register",userData);
    return response.data;
})  
export const logoutUser = createAsyncThunk("auth/logout",async()=>{
    localStorage.removeItem("token");
    return true;
})