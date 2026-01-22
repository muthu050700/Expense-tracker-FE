export default (state, action) => {
    switch (action.type) {
        case "SET_TRANSACTIONS":
            return {
                ...state,
                transactions: action.payload
            };
        case 'DELETE_TRANSACTION':
            return {
                ...state,
                transactions: state.transactions?.filter(transaction => transaction._id !== action.payload)
            }
        case 'ADD_TRANSACTION':
            return {
                ...state,
                transactions: [action.payload, ...state.transactions]
            }
        case 'FIND_TRANSACTION':
            return {
                ...state,
                transactionToEdit: action.payload
            }
        case 'UPDATE_TRANSACTION':
            return {
                ...state,
                transactions: state.transactions.map(transaction =>
                    transaction._id === action.payload._id ? action.payload : transaction
                ),
                transactionToEdit: null
            }
        case 'CLEAR_EDIT':
            return {
                ...state,
                transactionToEdit: null
            }
        default:
            return state;
    }
}
