import React from "react";
import { useState } from "react";
import NotaList from "../components/notaList";
import ListNotaCom from "../components/nota";

const Nota = () => {
  const [data, setData] = useState([]);
  const [dataId, setDataId] = useState(0);
  const [reload, setReload] = useState(false);

  return (
    <div className="columns">
      <div className="column is-7 has-text-centered">
        <NotaList
          reload={reload}
          setReload={setReload}
          setNotaDetail={setData}
          setDataId={setDataId}
        />
      </div>
      <div className="column is-5 font-Overpass">
        <ListNotaCom
          data={data}
          dataId={dataId}
          setDataId={setDataId}
          setData={setData}
          setReload={setReload}
          setting={"clear"}
        />
      </div>
    </div>
  );
};

export default Nota;
