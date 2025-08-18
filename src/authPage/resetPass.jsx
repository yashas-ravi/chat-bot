import {  useState } from 'react';
import './auth.css';
import {nhost} from '../utility/nhost';
import { useNavigate , useSearchParams} from 'react-router-dom';
import { toast } from 'react-toastify';
const ResetPass = () => {
    const [password, setPassword] = useState();
    const [conPassword, setConPassword] = useState();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get("ticket");

    const submit= async (e)=>{
            e.preventDefault();
            const submitBtn = document.getElementById('submitBtn');
            submitBtn.style.backgroundColor='rgba(111, 82, 151, 0.64)';
            submitBtn.ariaDisabled=true;
            submitBtn.style.cursor='progress';
            const valPass = password&&password.length>=9&&password.length<=20;
            const valConPass = conPassword&&conPassword.length>=9&&conPassword.length<=20;
            if(!valPass||!valConPass){
                toast.error("Passwords must be 9-20 characters long");
            }
            if(password!==conPassword){
                toast.error("Passwords must be same");
            }
            if(!token){
                toast.error("Invalid or missing reset token");
            }
            if(valPass&&valConPass){
            const res = await nhost.auth.changePassword({newPassword:password});
            if(res.error){
                console.log(res.error.message);
                toast.error(res.error.message);
            }
            else{        
                toast.info("check your mail");
                await new Promise(reslove=>setTimeout(reslove,1000));
                navigate('/signin');
            }
            submitBtn.style.backgroundColor='rgba(116, 49, 209, 0.782)';
            submitBtn.ariaDisabled=false;
            submitBtn.style.cursor='pointer';
        }
    }
    return <div className="forgotpass">
        <div className="container">
            <h1>Reset Password</h1>
            <form  className="auth-form">
                <label>Enter Password</label>
                <input type="password" onChange={(e)=>setPassword(e.target.value)} required/>
                <label>Confirm Password</label>
                <input type="password" onChange={(e)=>setConPassword(e.target.value)} required/>
                <button onClick={submit}>Login</button>
            </form>
        </div>
    </div>
}

export default ResetPass; 