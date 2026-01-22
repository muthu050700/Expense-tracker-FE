import React, { useState, useContext, useEffect } from 'react'
import { GlobalContext } from '../context/GlobalState';

export const AddTransaction = () => {
    const [text, setText] = useState('');
    const [amount, setAmount] = useState(0);
    const { addTransaction, transactionToEdit, editTransaction } = useContext(GlobalContext);

    useEffect(() => {
        if (transactionToEdit) {
            setText(transactionToEdit.text);
            setAmount(transactionToEdit.amount);
        } else {
            setText('');
            setAmount(0);
        }
    }, [transactionToEdit]);

    const onSubmit = e => {
        e.preventDefault();

        const newTransaction = {
            text,
            amount: +amount
        }

        if (transactionToEdit) {
            editTransaction(transactionToEdit._id, newTransaction);
        } else {
            addTransaction(newTransaction);
        }

        setText('');
        setAmount(0);
    }

    return (
        <>
            <h3>{transactionToEdit ? 'Edit' : 'Add new'} transaction</h3>
            <form onSubmit={onSubmit}>
                <div className="form-control">
                    <label htmlFor="text">Text</label>
                    <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text..." />
                </div>
                <div className="form-control">
                    <label htmlFor="amount"
                    >Amount <br />
                        (negative - expense, positive - income)</label
                    >
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        onFocus={() => amount === 0 && setAmount('')}
                        onBlur={() => amount === '' && setAmount(0)}
                        placeholder="Enter amount..."
                    />
                </div>
                <button className="btn">{transactionToEdit ? 'Update' : 'Add'} transaction</button>
            </form>
        </>
    )
}
