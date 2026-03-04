import React, { useContext } from 'react';
import { Transaction } from './Transaction';
import { GlobalContext } from '../context/GlobalState';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export const TransactionList = () => {
    const { transactions, selectedDate, updateFilterDate } = useContext(GlobalContext);
    console.log(transactions, "transactions");

    return (
        <>
            <div className="list-header">
                <h3>History</h3>
                <div className="filter-container">
                    <label>Filter by Month: </label>
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => updateFilterDate(date)}
                        dateFormat="MM/yyyy"
                        showMonthYearPicker
                        placeholderText="Select month"
                    />
                </div>
            </div>
            <ul className="list">
                {transactions?.length > 0 ? (
                    transactions.map(transaction => (<Transaction key={transaction._id} transaction={transaction} />))
                ) : (
                    <li className="no-transactions">No transactions found for this month</li>
                )}
            </ul>
        </>
    )
}
