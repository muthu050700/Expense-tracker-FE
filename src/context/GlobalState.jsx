import React, { createContext, useReducer, useEffect, useState } from 'react';
import AppReducer from './AppReducer';
import { toast } from 'react-hot-toast';

// Initial state
const initialState = {
    transactions: [],
    transactionToEdit: null
}



// Create context
export const GlobalContext = createContext(initialState);

// Provider component
export const GlobalProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AppReducer, initialState);

    const getTransaction = async () => {
        try {
            const res = await fetch("http://localhost:7777/getAllExpense");
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
    }, [])

    // Actions
    async function deleteTransaction(id) {
        try {
            const res = await fetch(`http://localhost:7777/deleteExpense/${id}`, {
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
            const res = await fetch("http://localhost:7777/user/expense", {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(transaction)
            });
            const data = await res.json();

            if (res.ok) {
                if (data.data) {
                    dispatch({
                        type: "SET_TRANSACTIONS",
                        payload: data.data
                    });
                } else {
                    dispatch({
                        type: 'ADD_TRANSACTION',
                        payload: data
                    });
                }
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
            const res = await fetch(`http://localhost:7777/updateExpense/${id}`, {
                method: "PUT",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(transaction)
            });
            const data = await res.json();

            if (res.ok) {
                if (data.data && Array.isArray(data.data)) {
                    dispatch({
                        type: "SET_TRANSACTIONS",
                        payload: data.data
                    });
                } else {
                    dispatch({
                        type: 'UPDATE_TRANSACTION',
                        payload: data.data || data
                    });
                }
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
        deleteTransaction,
        addTransaction,
        findTransaction,
        clearEdit,
        editTransaction
    }}>
        {children}
    </GlobalContext.Provider>);
}
