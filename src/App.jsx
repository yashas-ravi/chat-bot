import SignIn from './authPage/signIn';
import SignUp from './authPage/signUp';
import ForgotPass from './authPage/forgotPass';
import ResetPass from './authPage/resetPass';
import Home from './homePage/home';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { NhostProvider, useAuthenticationStatus } from '@nhost/react'
import { NhostApolloProvider } from '@nhost/react-apollo'
import { nhost } from './utility/nhost';

const AuthGate=({children})=>{
    const { isLoading, isAuthenticated } = useAuthenticationStatus();
    if(isLoading){
    return <div style={{width:"100%",height:"100vh",display:'flex',alignItems:'center',justifyContent:'center'}}><h2 style={{color:'blue'}}>Loading...</h2></div>
    }
    return isAuthenticated?children:<Navigate to='/SignIn' />;
}

const App = () => {
    return <NhostProvider nhost={nhost}>
            <NhostApolloProvider nhost={nhost}>
                <Router>
                    <Routes>
                        <Route path="/SignUp" element={<SignUp/>}/>
                        <Route path="/SignIn" element={<SignIn/>}/>
                        <Route path='/forgot-pass' element={<ForgotPass/>}></Route>
                        <Route path='/reset-password' element={<ResetPass/>}></Route>
                        <Route path="/" element={<AuthGate><Home/></AuthGate>}/>
                    </Routes>
                </Router>
        </NhostApolloProvider>
    </NhostProvider>
}

export default App;