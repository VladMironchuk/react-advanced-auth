import {createContext, useCallback, useEffect, useState} from "react";

let logoutTimer

const AuthContext = createContext({
  token: '',
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {}
})

const calculateRemainingTime = (expTime) => {
  const currentTime = new Date().getTime()
  const adjExpTime = new Date(expTime).getTime()

  return adjExpTime - currentTime
}

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem('token')
  const storedExpTime = localStorage.getItem('expTime')

  const remainingTime = calculateRemainingTime(storedExpTime)

  if(remainingTime <= 60000) {
    localStorage.removeItem('token')
    localStorage.removeItem('expTime')
    return null
  }

  return {
    token: storedToken,
    duration: remainingTime
  }
}

export const AuthContextProvider = (props) => {

  const tokenData = retrieveStoredToken()
  let initialToken

  if(tokenData) {
    initialToken = tokenData.token
  }

  const [token, setToken] = useState(initialToken)

  const userIsLoggedIn = !!token

  const logoutHandler = useCallback(() => {

    setToken(null)

    localStorage.removeItem('token')
    localStorage.removeItem('expTime')

    if(logoutTimer) {
      clearTimeout(logoutTimer)
    }
  
  },[])

  const loginHandler = (token, expTime) => {
    setToken(token)
    localStorage.setItem('token', token)
    localStorage.setItem('expTime', expTime)

    const remainingTime = calculateRemainingTime(expTime)


    logoutTimer = setTimeout(logoutHandler, remainingTime)
  }

  useEffect(() => {
    if(tokenData) {
      logoutTimer = setTimeout(logoutHandler, tokenData.duration)
    }
  }, [tokenData, logoutHandler])

  const contextValue = {
    token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler
  }


  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthContext