import { useState } from 'react';
import { AuthContext } from '../providers/auth'

function GlobalStyle() {
  return (
      <style global jsx>{`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      list-style: none;
    }
    body {
      font-family: 'Open Sans', sans-serif;
    }
    /* App fit Height */ 
    html, body, #__next {
      min-height: 100vh;
      display: flex;
      flex: 1;
    }
    #__next {
      flex: 1;
    }
    #__next > * {
      flex: 1;
    }
    /* ./App fit Height */ 

    @keyframes gradient {
      0% {
        background-position: 0% 0%;
      }
      50% {
        background-position: 100% 100%;
      }
      100% {
        background-position: 0% 0%;
      }
    }
  `}</style>
  );
}


export default function CustomApp({ Component, pageProps }) {
  const initialValue = '';
  const [user, setUser] = useState(() => getLocalStorage('user'));
  
  
  function getLocalStorage(key) {
    try {
      const value = window.localStorage.getItem(key);
      return value ? JSON.parse(value) : initialValue;
    } catch (e) {
      // if error, return initial value
      return initialValue;
    }
  }
 
  return (
      <>
          <GlobalStyle />
          <AuthContext.Provider value={{user, setUser}}>
            <Component {...pageProps} />
          </AuthContext.Provider>
      </>
  );
}
