import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import axios from "axios";
import DateDropdownRow from "./dropdown";

const NotaList = ({ setNotaDetail, setDataId, reload, setReload }) => {
  const [notas, setNotas] = useState([]);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  // date data
  let now = new Date();
  const [date, setDate] = useState({
    year: now.getFullYear(), // tahun saat ini
    month: now.getMonth() + 1, // bulan saat ini (ditambah 1 karena getMonth() mengembalikan bulan dari 0-11)
    day: now.getDate(), // hari saat ini
  });
  const [search, setSearch] = useState(0);

  useEffect(() => {
    getNotas();
    setSearch(0);
    setReload(false);
  }, [search, reload]);

  const changePage = ({ selected }) => {
    setPage(selected);
  };

  const getNotas = async () => {
    const response = await axios.get(`http://localhost:5000/nota`, {
      params: {
        date: date,
        page: 0,
        limit: 0,
      },
    });

    setNotas(response.data.result);
    setPage(response.data.page);
    setPages(response.data.totalPage);
    setRows(response.data.totalRows);
  };

  const handleDetail = (index) => {
    let nota = JSON.parse(notas[index].Item);
    setNotaDetail(nota);
    setDataId(notas[index].id);
  };

  return (
    <div className="container">
      <DateDropdownRow
        selectedDate={date}
        setSelectedDate={setDate}
        setSearch={setSearch}
      />
      <table className="table is-striped is-bordered is-fullwidth mt-2">
        <thead>
          <tr>
            <th className="has-background-info has-text-white">TANGGAL</th>
            <th className="has-background-info has-text-white">ITEM</th>
            <th className="has-background-info has-text-white">TOTAL</th>
            <th className="has-background-info has-text-white">DETILE</th>
          </tr>
        </thead>
        <tbody className="has-text-weight-bold">
          {notas.map((temp, index) => {
            let nota = JSON.parse(temp.Item);
            let date = new Date(temp.createdAt);

            // console.log(total());

            let year = date.getFullYear(); // Tahun
            let day = date.getDate(); // Tanggal
            let monthName = date.toLocaleString("id-ID", { month: "short" });
            let dayName = date.toLocaleString("id-ID", { weekday: "long" });
            return (
              <tr key={index}>
                <td className="is-size-5">
                  {dayName},{year}-{monthName}-{day}
                </td>

                <td>
                  {nota.slice(0, 3).map((item, i) => (
                    <div className="has-text-left">
                      <div key={i}>
                        @{item.quantity}
                        {"\t\t"}
                        {item.nama.length > 25
                          ? item.nama.slice(0, 23) + "..."
                          : item.nama}
                        ,
                      </div>
                    </div>
                  ))}
                  {nota.length > 3 ? " +" + (nota.length - 3) : ""}
                </td>
                <td>Rp.{temp.total.toLocaleString("id-ID")}</td>
                <td>
                  <button
                    class="button is-primary"
                    onClick={() => handleDetail(index)}
                  >
                    Detail
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p>
        Total Rows: {rows} Pages {rows ? page + 1 : 0} of {pages}
      </p>
      <nav
        className="pagination is-centered"
        key={rows}
        role="navigation"
        aria-label="pagination"
      >
        <ReactPaginate
          previousLabel={"< Prev"}
          nextLabel={"Next >"}
          pageCount={pages}
          onPageChange={changePage}
          containerClassName={"pagination-list"}
          pageLinkClassName={"pagination-link"}
          previousLinkClassName={"pagination-previous"}
          nextLinkClassName={"pagination-next"}
          activeLinkClassName={"pagination-link is-current"}
          disabledLinkClassName={"pagination-link is-disabled"}
        />
      </nav>
    </div>
  );
};

export default NotaList;
