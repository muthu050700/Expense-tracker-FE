import React, { createContext, useReducer, useEffect, useState } from 'react';
import AppReducer from './AppReducer';
import { toast } from 'react-hot-toast';

// Initial state
const initialState = {
    transactions: [],
    transactionToEdit: null,
    selectedDate: new Date()
}



// Create context
export const GlobalContext = createContext(initialState);

// Provider component
export const GlobalProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AppReducer, initialState);

    const getTransaction = async (date) => {
        try {
            const dateToFetch = date || state.selectedDate;
            const month = dateToFetch.getMonth() + 1;
            const year = dateToFetch.getFullYear();

            // Assuming the backend expects month and year or a formatted date string
            // Based on user request "current month date will be passed", I'll format it
            const res = await fetch(`https://expense-tracker-be-zhqy.onrender.com/getAllExpense?month=${month}&year=${year}`);
            const data = await res.json();

            if (res.ok) {
                dispatch({
                    type: "SET_TRANSACTIONS",
                    payload: data.data
                });
                if (data.message) toast.success(data.message);
            } else {
                toast.error(data.message || "Failed to fetch transactions");
            }
        } catch (err) {
            toast.error("Server Error: Failed to fetch transactions");
            console.error(err);
        }
    };

    useEffect(() => {
        getTransaction()
    }, [state.selectedDate])

    // Actions
    function updateFilterDate(date) {
        dispatch({
            type: 'UPDATE_FILTER_DATE',
            payload: date
        });
    }

    async function deleteTransaction(id) {
        try {
            const res = await fetch(`https://expense-tracker-be-zhqy.onrender.com/deleteExpense/${id}`, {
                method: 'DELETE'
            });
            const data = await res.json();

            if (res.ok) {
                dispatch({
                    type: 'DELETE_TRANSACTION',
                    payload: id
                });
                toast.success(data.message || "Transaction deleted successfully");
            } else {
                toast.error(data.message || "Failed to delete transaction");
            }
        } catch (err) {
            toast.error("Server Error: Failed to delete transaction");
            console.error(err);
        }
    }

    async function addTransaction(transaction) {
        try {
            const res = await fetch("https://expense-tracker-be-zhqy.onrender.com/user/expense", {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(transaction)
            });
            const data = await res.json();

            if (res.ok) {
                // After adding, we might want to re-fetch for the current selected month
                getTransaction();
                toast.success(data.message || "Transaction added successfully");
            } else {
                toast.error(data.message || "Failed to add transaction");
            }
        } catch (err) {
            toast.error("Server Error: Failed to add transaction");
            console.error(err);
        }
    }

    function findTransaction(transaction) {
        dispatch({
            type: 'FIND_TRANSACTION',
            payload: transaction
        });
    }

    function clearEdit() {
        dispatch({
            type: 'CLEAR_EDIT'
        });
    }

    async function editTransaction(id, transaction) {
        try {
            const res = await fetch(`https://expense-tracker-be-zhqy.onrender.com/updateExpense/${id}`, {
                method: "PUT",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(transaction)
            });
            const data = await res.json();

            if (res.ok) {
                // After editing, re-fetch for the current selected month
                getTransaction();
                toast.success(data.message || "Transaction updated successfully");
            } else {
                toast.error(data.message || "Failed to edit transaction");
            }
        } catch (err) {
            toast.error("Server Error: Failed to edit transaction");
            console.error(err);
        }
    }

    return (<GlobalContext.Provider value={{
        transactions: state.transactions,
        transactionToEdit: state.transactionToEdit,
        selectedDate: state.selectedDate,
        deleteTransaction,
        addTransaction,
        findTransaction,
        clearEdit,
        editTransaction,
        updateFilterDate
    }}>
        {children}
    </GlobalContext.Provider>);
}
