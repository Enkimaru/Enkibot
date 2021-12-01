import "./userList.css";
import React,{useState,useEffect} from 'react';
import { DataGrid } from "@material-ui/data-grid";
import { DeleteOutline } from "@material-ui/icons";

export default function UserList() {
  const [data,setData]=useState([]);
  const getData=()=>{
    fetch('../data.json'
    ,{
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
    }
    )
      .then(function(response){
        console.log(response)
        return response.json();
      })
      .then(function(myJson) {
        console.log(myJson);
        setData(myJson)
      });
  }
  useEffect(()=>{
    getData()
  },[])

  const handleDelete = (id) => {
    //setData(data.filter((item) => item.id !== id));
    fetch('http://localhost:8080/?id='+id, { method: 'DELETE' })
  };
  
  const columns = [
    { field: "username", headerName: "Twitch ID", width: 150 },
    { field: "replayId", headerName: "Replay ID", width: 200 },
    {
      field: "subscriber",
      headerName: "Inscrito",
      width: 150,
    },
    {
      field: "action",
      headerName: "Remover da Fila",
      width: 250,
      renderCell: (params) => {
        return (
          <>
            <DeleteOutline
              className="userListDelete"
              onClick={() => handleDelete(params.row.id)}
            />
          </>
        );
      },
    },
  ];

  return (
    <div className="userList">
      <DataGrid
        rows={data}
        disableSelectionOnClick
        columns={columns}
        pageSize={8}
      />
    </div>
  );
}
