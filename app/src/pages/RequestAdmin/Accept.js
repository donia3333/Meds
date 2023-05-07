import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAutherUser } from '../../Storage';


function UpdatePatient() {
    const auth = getAutherUser();
  const [Accept, setAccept] = useState("");
  const { id } = useParams();

  const handleSubmit = async (event) => {
    
    event.preventDefault();
    if (!Accept) return; // Prevent submitting if accept value is empty
    try {
      const response = await fetch(`http://localhost:2000/request/updaterequest/${id}`, {
        method: "PUT",
        headers: { token:auth.token    ,"Content-Type": "application/json" },
        body: JSON.stringify({ Accept }),
      });
      const data = await response.json();
      console.log(data); // Check the updated data in console
      window.location.href = "/request"; // Redirect to home page after successful update
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <div className="login">
        <div className="box" style={{height:"250px"}}>
          
              <h2>Update Categ_Meds</h2>
              <form onSubmit={handleSubmit}>
               <label htmlFor="accept" style={{marginRight:"4px",fontWeight:"bold"}}>Accept or Decline: </label>

                <input
                  type="text"
                  id="Accept"
                  style={{width:"300px" ,border:"1px solid" ,borderRadius:"8px"}}
                  value={Accept}
                  onChange={(e) => setAccept(e.target.value)}
                />
                <br/>
                <div  style={{marginTop:"30px"}}>
                  <button className="btn btn-primary" style={{width:"200px"}} type="submit">Update</button>
                  <Link className="btn btn-danger" style={{width:"200px",marginLeft:"10px"}} to="/request">Cancel</Link>
                </div>
                
              </form>
              
             
            </div>
          </div>
        </div>
   
  );
}

export default UpdatePatient;
