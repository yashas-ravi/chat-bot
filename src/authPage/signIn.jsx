import {  useState } from 'react';
import './auth.css';
import {nhost} from '../utility/nhost';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const SignIn = () => {

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const navigate = useNavigate();

    const submit= async (e)=>{
        e.preventDefault();
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.style.backgroundColor='rgba(111, 82, 151, 0.64)';
        submitBtn.ariaDisabled=true;
        submitBtn.style.cursor='progress';
        if(!password||password.length>20||password.length<9){
            toast.error("password must be 9-20 charaters long");
        }
        else{
            const res = await nhost.auth.signIn({email:email,password:password});
            if(res.error){
                if(res.error.message==="User is already signed in"){
                    nhost.auth.signOut();
                    toast.info("Please try again");
                }
                else{
                console.log(res.error.message);
                toast.error(res.error.message);
                }
            }
            else{          
                toast.success("login success");
                await new Promise(reslove=>setTimeout(reslove,1000));
                navigate('/');
            }
        }
        submitBtn.style.backgroundColor='rgba(116, 49, 209, 0.782)';
        submitBtn.ariaDisabled=false;
        submitBtn.style.cursor='pointer';
    }

    return <div className="signIn">
        <div className="container">
            <h1>Welcome back to Subspace AI</h1>
            <form  className="auth-form">
                <label>E-mail</label>
                <input type="email" onChange={(e)=>setEmail(e.target.value)} required/>
                <label>Password</label>
                <input type="password" onChange={(e)=>setPassword(e.target.value)} required/>
                <button id='submitBtn' onClick={submit}>Login</button>
            </form>
            <p>dont have account?<a href='/SignUp'> SignUp</a></p>
            <p><a href='/forgot-pass'>Forgot Password?</a></p>
        </div>
    </div>
}

export default SignIn;