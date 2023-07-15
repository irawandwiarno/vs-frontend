import React, { useState } from "react";
import ItemList from "./components/ItemList";
import ListNota from "./components/ListNota";

function App() {
  const [data, setData] = useState([]);
  const [reload, setReload] = useState(false);


  return (
    <div className="columns">
      <div className="column is-7 has-text-centered">
        <ItemList setData={setData} reload={ reload} setReload={setReload} />
      </div>
      <div className="column is-5 font-Overpass">
        <ListNota
          data={data}
          setData={setData}
          setReload={setReload}
        />
      </div>
    </div>
  );
}

export default App;
