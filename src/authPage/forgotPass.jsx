import {  useState } from 'react';
import './auth.css';
import {nhost} from '../utility/nhost';
import {  useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const ForgotPass = () => {
    const [email, setEmail] = useState();
    const navigate = useNavigate();

    const submit= async (e)=>{
            e.preventDefault();
            const submitBtn = document.getElementById('submitBtn');
            submitBtn.style.backgroundColor='rgba(111, 82, 151, 0.64)';
            submitBtn.ariaDisabled=true;
            submitBtn.style.cursor='progress';
            const res = await nhost.auth.resetPassword({email:email},{redirectTo:"http://localhost:3000/reset-password"});
            if(res.error){
                console.log(res.error.message);
                toast.error(res.error.message);
            }
            else{     
                toast.info("check your mail, may be in Spam folder");
                await new Promise(reslove=>setTimeout(reslove,2000));
                navigate('/signin');
            }
    }
    return <div className="forgotpass">
        <div className="container">
            <h1>Forget Password</h1>
            <form  className="auth-form">
                <label>E-mail</label>
                <input type="email" onChange={(e)=>setEmail(e.target.value)} required/>
                <button id='submitBtn' onClick={submit}>Login</button>
            </form>
        </div>
    </div>
}

export default ForgotPass; 