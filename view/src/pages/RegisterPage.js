import { useState } from 'react';
import '../app.css'
import axios from 'axios';




function RegisterPage() {

  const [selectedOption, setSelected_option] = useState('S');

  const handleOption_change = (event)=>{
    setSelected_option(event.target.value);
    
  }



  const [landlord_info, setlandlord_info] = useState({  
    Name: '',
    Surname: '',
    Address: '',
    DateofBirth: '',
    Email: '',
    Password: '',});


    const [spectator_info, setspectator_info] = useState({  
    Name: '',
    Surname: '',
    Email: '',
    Password: '',});

    const [performer_info, setperformer_info] = useState({  
    Name: '',
    Surname: '',
    Artist: '',
    Category: 'Concert',
    Email: '',
    Password: '',});

  const handleChange = (event)=>{
    const { name, value } = event.target;
    console.log("Event.target: ", name, value)


    switch(selectedOption){

      case 'L':
          setlandlord_info((prevInfo) => ({ ...prevInfo, [name]: value }));
          break;

      case 'P':
          setperformer_info((prevInfo) => ({ ...prevInfo, [name]: value }));
          break;

      case 'S':
          setspectator_info((prevInfo) => ({ ...prevInfo, [name]: value }));
          break;
      default:
          console.log("None of the cases were selected")
          break;

        
        }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Performer info", performer_info)    
    const result = await register();
    console.log(result);
  }

  async function register() {
    console.log(selectedOption)
    
    try {
        switch(selectedOption){

            case 'L':
                return await axios.post('/register/Landlord', landlord_info);
            
            case 'P':
        
                return await axios.post('/register/Performer', performer_info);
            case 'S':

                return await axios.post('/register/Spectator', spectator_info);

            default: 
                return "None of the options was selected"
        
        }
  } catch (error) {
        console.log(error);
  }
        
        
    
}



  return (
  <div className='RegisterPage'>

    <h1>Register</h1>

    <p>Please select the type of user:</p>
    <div className='User-Selector'>

      <div className='selector-input'>
        <input type="radio" id="Landlord" name="user" value='L'  checked={selectedOption === 'L'} onChange={handleOption_change}/>
        <label htmlFor="Landlord">Landlord</label>
      </div>
      <div className='selector-input'>
        <input type="radio" id="Performer" name="user" value='P'  checked={selectedOption === 'P'} onChange={handleOption_change}/>
        <label htmlFor="Performer">Performer</label>
      </div>
      <div className='selector-input'>
        <input type="radio" id="Spectator" name="user" value='S'  checked={selectedOption === 'S'} onChange={handleOption_change}/>
        <label htmlFor="Spectator">Spectator</label>
      </div>
    </div>

    {
  (() => {
    switch (selectedOption) {
      case 'L':
        return (
          <form className='Form'>
            <input className='register-element' type="text" placeholder='Name' name='Name' value={landlord_info.Name} onChange={handleChange} />
            <input className='register-element' type="text" placeholder="Surname" name='Surname' value={landlord_info.Surname} onChange={handleChange} />
            <input className='register-element' type="text" placeholder="Address" name='Address' value={landlord_info.Address} onChange={handleChange} />
            <input className='register-element' type="date" placeholder="Date of birth" name='DateofBirth' value={landlord_info.DateofBirth} onChange={handleChange} />
            <input className='register-element' type="email" placeholder="your@email.com" name='Email' value={landlord_info.Email} onChange={handleChange} />
            <input className='register-element' type="password" placeholder="Password" name='Password' value={landlord_info.Password} onChange={handleChange} />
            <button className='register-element' type="submit" onClick={handleSubmit}>Register</button>
          </form>
        );
      case 'S':
        return(
          <form className='Form'>
            <input className='register-element' type="text" placeholder='Name' name='Name' value={spectator_info.Name} onChange={handleChange} />
            <input className='register-element' type="text" placeholder="Surname" name='Surname' value={spectator_info.Surname} onChange={handleChange} />
            <input className='register-element' type="email" placeholder="your@email.com" name='Email' value={spectator_info.Email} onChange={handleChange} />
            <input className='register-element' type="password" placeholder="Password" name='Password' value={spectator_info.Password} onChange={handleChange} />
            <button className='register-element' type="submit" onClick={handleSubmit}>Register</button>
          </form>
        );
        case 'P':
        return(
          <form className='Form'>
            <input className='register-element' type="text" placeholder='Name' name='Name' value={performer_info.Name} onChange={handleChange} />
            <input className='register-element' type="text" placeholder="Surname" name='Surname' value={performer_info.Surname} onChange={handleChange} />
            <input className='register-element' type="email" placeholder="your@email.com" name='Email' value={performer_info.Email} onChange={handleChange} />
            <select className='register-element' name='Category' value={performer_info.Category} onChange={handleChange}>
              <option>Concert</option>
              <option>Theatre</option>
              <option>Film</option>
              <option>Sports</option>
              <option>Art Exhibition</option>
              <option>Conference</option>
              <option>Party</option>
              <option>Fitness</option>
            </select>
            <input className='register-element' type="text" placeholder="Artist" name='Artist' value={performer_info.Artist} onChange={handleChange} />
            <input className='register-element' type="password" placeholder="Password" name='Password' value={performer_info.Password} onChange={handleChange} />
            <button className='register-element' type="submit" onClick={handleSubmit}>Register</button>
          </form>
        )
      // Add other cases for different options if needed
      default:
        return null;
    }
  })()
}
    
    
  </div>
  );
}

export default RegisterPage;
