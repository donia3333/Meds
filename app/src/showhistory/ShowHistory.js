import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "react-bootstrap/esm/Table";
import { getAutherUser } from "../Storage";

const ShowHistory = () => {
    const auth = getAutherUser();
    const [history, sethistory] = useState([]);

    useEffect(() => {
      axios
        .get(`http://localhost:2000/medicine/search/${auth.id}`)
        .then((res) => sethistory(res.data))
        .catch((err) => console.log(err));
    }, []);

    return (
      <>
        <div className="container-fluid documentation">
          <div className="row justify-content-center">
                <Table striped bordered hover className="styled-table w-50 my-5">
                  <thead>
                    <tr>
                      <th>Name Of Medicine </th>
              
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((data, i) => (
                      <tr key={i}>
                        <td>{data.searchTerm}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
      </>
    );
};

export default ShowHistory;