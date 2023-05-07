import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {Link} from "react-router-dom";
import M from '../images/M.png';
import { removeAutherUser , getAutherUser } from '../Storage';
import { useNavigate } from 'react-router-dom';
import "../css/Header.css"
import Button from 'react-bootstrap/esm/Button';



const Header = () => {
  const navigate = useNavigate();
  const auth = getAutherUser()
    const Logout = () =>{
      removeAutherUser();
      navigate("/");
      
    }
    const Contact = () =>{
      navigate("/contact");
      
    }
    return (
        <>
          <Navbar  expand="lg" className=' w-100  navbarr shadow'>
            <Container>
              <Navbar.Brand href="/"> <img src={M} width="60" height="60" className="d-inline-block align-top"alt="React Bootstrap logo"/>  </Navbar.Brand>
              <Nav className="me-auto navbar-navv">
                {/* unAuthunticated */}
               {!auth &&(
                  <>
                    <Link className='nav-link' to={'/login'}>Login</Link>
                    <Link className='nav-link' to={'/register'}>Register</Link>
                  </>
               )}

                {/* user */}
                 {auth && auth.role===0 &&(
                  <>
                     <Link className='nav-link' to={'/'}>List Medicines</Link>
                     <Link className='nav-link' to={'/req'}>Show Requests</Link>
                     <Link className='nav-link' to={'/show'}>history</Link>
                     
                  </>
                  

                 )

                 }
               

               
               

               {/* admin */}
               {auth && auth.role===1 && (
                  <>
                    <Link className='nav-link' to={'/manage'}>Manage Medicines</Link>
                    <Link className='nav-link' to={'/manages'}>Manage categories</Link>
                    <Link className='nav-link' to={'/patient'}>Manage patient</Link>
                    <Link className='nav-link' to={'/request'}>Manage Request</Link>
                  </>
               )}


               
             </Nav>
             
             <Nav className="ms-auto">
               {/* Authunticated */}
               
                 
               {auth &&(
                <>
                 <Button className='mx-5' onClick={Logout}>Logout</Button>
                 <Button  onClick={Contact}>Contact US</Button>
                </>
               
               )}
                 
               
              

             </Nav>
            </Container>
           </Navbar>
        </>
    );
};

export default Header;