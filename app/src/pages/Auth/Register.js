import React ,{useState}  from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import axios from 'axios';
import { setAutherUser } from '../../Storage';
import { useNavigate } from 'react-router-dom';
import M from "../../images/M.png"
import { Link } from 'react-router-dom';


const Register = () => {
  const navigate=useNavigate();
    const [register, setRegister]=useState({
    email: '',
    password:'',
    phone:'',
    loading: false,
    err:[]
  })

    const RegisterFun = (e) =>{
    e.preventDefault();
    setRegister({...register, loading:true, err:[]});
    axios.post("http://localhost:2000/auth/register" , {
      email: register.email,
      password: register.password,
      phone:register.phone
      
    }
    )
    .then((resp )=> {
      setRegister({...register, loading:false, err:[]});
      setAutherUser(resp.data);
      navigate("/");
    })
    .catch((errors) =>{
      setRegister({...register, loading:false,
         err:errors.response.data.errors,
      });
    });
  };

    return(
      <div className='login'>
        <div className='login-container'>
            <div className='box'>
            <h2 className='text'> <img src={M} alt="" />Registeration Form</h2>

         {register.err.map((error,index)=>(
         <Alert key={index}  className='px-2 py-2'  variant='danger'>
           {error.msg}
         </Alert>
))}

<Form onSubmit={RegisterFun}>
   <div className='inputs'>
   <Form.Group className="mb-3">
    <Form.Control type="email" placeholder="Email" value={register.email} onChange={(e) => setRegister({...register,email: e.target.value})} />
  </Form.Group>
  <Form.Group className="mb-3">
    <Form.Control type="phone" placeholder="Phone" value={register.phone} onChange={(e) => setRegister({...register,phone: e.target.value})} />
  </Form.Group>

  <Form.Group className="mb-3">
    <Form.Control type="password" placeholder="Password" value={register.password} onChange={(e) => setRegister({...register,password: e.target.value})} />
  </Form.Group>
   </div>
  
  <Button className='submit btn btn-primary opacity-75 w-100 my-3' variant="primary" type="submit"
  disabled={register.loading===true}
  >
    Register
  </Button>

           <div className='account'>
                <span>Already Have Account ?</span>
              </div>
              
              
              <div className="register">
                <Link className='submit btn btn-primary opacity-75 w-100' to="/login">login</Link>
              </div>
</Form>
            </div>
       

        </div>     
      </div>
  );
};

export default Register;