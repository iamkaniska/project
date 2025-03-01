import { createContext, useReducer } from 'react';

const AlertContext = createContext();

const alertReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ALERT':
      return [...state, action.payload];
    case 'REMOVE_ALERT':
      return state.filter(alert => alert.id !== action.payload);
    default:
      return state;
  }
};

export const AlertProvider = ({ children }) => {
  const [state, dispatch] = useReducer(alertReducer, []);

  // Set Alert
  const setAlert = (msg, type, timeout = 5000) => {
    const id = Math.random().toString(36).substring(2, 9);
    
    dispatch({
      type: 'SET_ALERT',
      payload: { msg, type, id }
    });

    setTimeout(() => dispatch({ type: 'REMOVE_ALERT', payload: id }), timeout);
  };

  return (
    <AlertContext.Provider
      value={{
        alerts: state,
        setAlert
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export default AlertContext;