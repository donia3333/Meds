import React,{useState}from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import '../../css/Login.css'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { setAutherUser } from '../../Storage';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert';
import M from '../../images/M.png';




const Login = () => {
    const navigate=useNavigate();
    const [login, setLogin]=useState({
    email: '',
    password:'',
    loading: false,
    err:[],
  });
  const LoginFun = (e) =>{
    e.preventDefault();
    setLogin({...login, loading:true, err:[]});
    axios.post("http://localhost:2000/auth/login" , {
      email: login.email,
      password: login.password,
    })
    .then((resp )=> {
      setLogin({...login, loading:false, err:[]});
      setAutherUser(resp.data);
      navigate("/");

    })
    .catch((errors) =>{
      setLogin({...login, loading:false, err:errors.response.data.errors,
      });
    });
  };
    return (
        <div className='login'>
          <div className='login-container'>
           <div className='box'>
           <h2 className='text'> <img src={M} alt="" />Login Form</h2>
          
           {login.err.map((error,index)=>(
           <Alert key={index}  className='px-2 py-2'  variant='danger'>
             {error.msg}
           </Alert>
    ))}
           <Form onSubmit={LoginFun}>
             <div className='inputs'>
             <Form.Group className="input mb-3">
             <Form.Control type="email" placeholder="Email" value={login.email} onChange={(e) => setLogin({...login,email: e.target.value})} />
             </Form.Group>

             <Form.Group className="input mb-3">
             <Form.Control type="password" placeholder="Password" value={login.password} 
                onChange={(e) => setLogin({...login,password: e.target.value})}  />
             </Form.Group>

             </div>
              <div className='submit'>
                <Button className='submit btn btn-primary opacity-75 py-2 w-100 my-3' type="submit" disabled={login.loading===true}>
                  Login
               </Button>

              </div>
              {/* <Link className='submit btn btn-dark' to="/">login</Link> */}

              <div className='account'>
                <span>Don't Have Any Account ?</span>
              </div>
              
              
              <div className="register">
                <Link className='submit btn btn-primary opacity-75 w-100' to="/register">register</Link>
              </div>
                    
            </Form> 
           </div>
        </div>
        </div>
    );
};

export default Login;