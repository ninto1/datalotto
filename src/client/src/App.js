import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from "react";
import axios from "axios";

function App() {
  const [dataSets, setDataSets] = useState()
  const updateData = ()=>{
    try {
      axios.get("api/data").then(res => {
        if (res.status === 200) setDataSets(res.data)
        console.log(res.data[0])
      })
    }catch (e) {
      console.log(e)
      setDataSets(undefined)
    }
  }
  useEffect(() => {
    updateData()
    setInterval(updateData,2500)
  }, []);
  return (
    <div className="App">
      <h1>DataLotto</h1>
      <header className="App-header">
        <table>
          <thead>
          <tr>
            <th>ID        </th>
            <th>IP</th>
            <th>Browser</th>
            <th>OS</th>
            <th>Touch</th>
            <th>Width</th>
            <th>Height</th>
            <th>WebGL</th>
            <th>Local Storage</th>
            <th>Submitted at</th>
            <th>Battery level</th>
          </tr>
          </thead>
        <tbody>
        {dataSets?dataSets.map(d=>{
          return (<tr>
            <td>{d.dsid}</td>
            <td>{d.ip}</td>
            <td>{d.browser === null ? "unknown" : d.browser}</td>
            <td>{d.os === null ? "unknown" : d.os}</td>
            <td>{d.touch === null ? "unknown" : d.touch}</td>
            <td>{d.width === null ? "?" : d.width}</td>
            <td>{d.height === null ? "?" : d.height}</td>
            <td>{d.webGL ? "Yes" : "No"}</td>
            <td>{d.localStorage ? "Yes" : "No"}</td>
            <td>{d.submittedat === null ? "unknown" : d.submittedat.split('.')[0].split('T').join(" ") + " UTC"}</td>
            <td>{d.battery === null ? "unknown" : d.battery + "%"}</td>
          </tr>)
        }) : <p>No data</p>}
        </tbody>
        </table>
      </header>
    </div>
  );
}

export default App;
