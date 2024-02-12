import { Link, Navigate } from "react-router-dom";
import { useState } from 'react';
import '../app.css'
import axios from 'axios';




function LoginPage() {

  const [redirect, setRedirect] = useState(false);


  const [login_info, setlogin_info] = useState({  
    Email: '',
    Password: '',});

  const handleChange = (event)=>{
    const { name, value } = event.target;
    setlogin_info((prevInfo) => ({ ...prevInfo, [name]: value }));
  }

  const handleSubmit = async (event) => {
    console.log(login_info)
    event.preventDefault();
    const result = await login();
    console.log(result)
    alert('Login successful');
    setRedirect(true);
  }

  async function login() {
  try {
    const response_landlord = await axios.post('/login/Landlord', login_info, {withCredentials: true});
    if(response_landlord.data === 'No email found'){
      const response_spec = await axios.post('/login/Spectator', login_info, {withCredentials: true});

      if(response_spec.data === 'No email found'){
        const response_per = await axios.post('/login/Performer', login_info, {withCredentials: true});
        if(response_per.data === 'No email found'){
    }
    else{

      console.log(response_per.data.token)
      localStorage.setItem("Performer-Token", response_per.data.token)
      return response_per;
    }
  }
  else{

    localStorage.setItem("Spectator-Token", response_spec.data.token)
    return response_spec;

  }
}
    else{
      console.log("Response: ", response_landlord)
      localStorage.setItem("Landlord-Token", response_landlord.data.token)
      return response_landlord;
    }
  } catch (error) {
    console.log(error);
    alert('Login failed');
  }
}

  if (redirect){
    return <Navigate to ={'/venue'}/>
  }

  return (
  <div className='LoginPage'>

    <h1>Login</h1>
    
      <form className='Form'>
        <input className='login-element' type="email" placeholder="your@email.com" name='Email' value={login_info.Email} onChange={handleChange} />
        <input className='login-element' type="password" placeholder="Password" name='Password' value={login_info.Password} onChange={handleChange} />
        <button className='login-element' type="submit" onClick={handleSubmit}>Login</button>
      </form>
        
    
    
  </div>
  );
}

export default LoginPage;
