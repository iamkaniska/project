import { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const initialState = {
  token: localStorage.getItem('token'),
  user: JSON.parse(localStorage.getItem('user')), // Retrieve user from localStorage
  isAuthenticated: null,
  loading: true,
  error: null
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'USER_LOADED':
      localStorage.setItem('user', JSON.stringify(action.payload)); // Store user in localStorage
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload
      };
    case 'REGISTER_SUCCESS':
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user)); // Store user in localStorage
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case 'AUTH_ERROR':
    case 'REGISTER_FAIL':
    case 'LOGIN_FAIL':
    case 'LOGOUT':
      localStorage.removeItem('token');
      localStorage.removeItem('user'); // Remove user from localStorage
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set auth token
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Load user
 // Load user
const loadUser = async () => {
  const token = localStorage.getItem('token'); // Get token from localStorage

  if (token) {
    setAuthToken(token); // Set token in Axios headers
  }

  try {
    const res = await axios.get('http://localhost:5001/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token}` // Send token in request headers
      }
    });

    dispatch({
      type: 'USER_LOADED',
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: 'AUTH_ERROR',
      payload: err.response?.data?.message || 'Authentication error'
    });
  }
};


  // Register user
  const register = async (formData) => {
    try {
      const res = await axios.post('http://localhost:5001/api/auth/register', formData);
  
      console.log("Register Response:", res.data);  // Debugging
  
      localStorage.setItem('token', res.data.token); // Store token
      localStorage.setItem('user', JSON.stringify(res.data.user)); // Store user data
  
      dispatch({ type: 'REGISTER_SUCCESS', payload: res.data });
  
      loadUser();  // Ensure user loads after register
    } catch (err) {
      console.error("Register Error:", err.response?.data?.message || err.message);
      dispatch({ type: 'REGISTER_FAIL', payload: err.response?.data?.message || 'Registration failed' });
    }
  };
  

  // Login user
  const login = async (formData) => {
    try {
      const res = await axios.post('http://localhost:5001/api/auth/login', formData);
      localStorage.setItem('token', res.data.token); // Store token
      localStorage.setItem('user', JSON.stringify(res.data.user)); // Store user data
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: res.data
      });
      
      loadUser();
    } catch (err) {
      dispatch({
        type: 'LOGIN_FAIL',
        payload: err.response?.data?.message || 'Login failed'
      });
    }
  };

  // Logout
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  // Clear errors
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Load user on initial render if token exists
  useEffect(() => {
    if (localStorage.token) {
      loadUser();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        register,
        login,
        logout,
        loadUser,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
