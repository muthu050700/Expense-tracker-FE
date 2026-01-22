import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';

export const Transaction = ({ transaction }) => {
    const { deleteTransaction, findTransaction, transactionToEdit, clearEdit } = useContext(GlobalContext);

    const sign = transaction.amount < 0 ? '-' : '+';
    const isEditing = transactionToEdit?._id === transaction._id;

    return (
        <li className={`transaction-item ${transaction.amount < 0 ? 'minus' : 'plus'}`}>
            <p className="transaction-text">{transaction.text}</p>
            <div className="transaction-amount-container">
                <span className="transaction-amount">
                    {sign}₹{Math.abs(transaction.amount)}
                </span>
                <div className="list-btn-container">
                    {isEditing ? (
                        <button onClick={() => clearEdit()} className="edit-btn" title="Cancel Edit" style={{ backgroundColor: '#ff9f43' }}>↺</button>
                    ) : (
                        <button onClick={() => findTransaction(transaction)} className="edit-btn" title="Edit">✎</button>
                    )}
                    <button onClick={() => deleteTransaction(transaction._id)} className="delete-btn" title="Delete">×</button>
                </div>
            </div>
        </li>
    )
}
