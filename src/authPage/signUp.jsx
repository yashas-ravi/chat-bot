import {  useState } from 'react';
import './auth.css';
import {nhost} from '../utility/nhost';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const SignUp = () => {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const navigate = useNavigate();

    const submit= async (e)=>{
        e.preventDefault();
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.style.backgroundColor='rgba(111, 82, 151, 0.64)';
        submitBtn.ariaDisabled=true;
        submitBtn.style.cursor='progress';
        const validname = name && name.length>=3&&name.length<=13;
        const validpass = password && password.length>=9&&password.length<=20; 
        if(!validname){
            toast.error("user name must be 3-13 charaters long");
        }
        if(!validpass){
            toast.error("password must be 9-20 charaters long");
        }
        if(validname&&validpass){
           const res = await nhost.auth.signUp({email:email,password:password,options:{metadata:{name:name}}});
           if(res.error){
            console.log(res.error.message);
            toast.error(res.error.message);
            }
            else{          
            toast.info("Verify your email, check your spam folder");
            await new Promise(reslove=>setTimeout(reslove,2000));
            navigate('/SignIn');
            }
          }
        submitBtn.style.backgroundColor='rgba(116, 49, 209, 0.782)';
        submitBtn.ariaDisabled=false;
        submitBtn.style.cursor='pointer';
        }

    return <div className="signUp">
        <div className="container">
            <h1>Welcome to Subspace AI</h1>
            <form className="auth-form">
                <label>Name</label>
                <input type="text" onChange={(e)=>setName(e.target.value)} required/>
                <label>E-mail</label>
                <input type="email" onChange={(e)=>setEmail(e.target.value)} required/>
                <label>Create Password</label>
                <input type="password" onChange={(e)=>setPassword(e.target.value)} required/>
                <button id='submitBtn' onClick={submit}>Create Account</button>
            </form>
            <p>already have account?<a href='/SignIn'> SignIn</a></p>
        </div>
    </div>
}

export default SignUp;