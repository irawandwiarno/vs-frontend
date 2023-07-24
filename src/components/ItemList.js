import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineEdit } from "react-icons/ai";
import Swal from "sweetalert2";

const ItemList = ({ setData, reload, setReload }) => {
  const [items, setItems] = useState([]);
  const [limit, setLimit] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);

  //ItemSet
  const [idItem, setIdItem] = useState("");
  const [nama, setNama] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [unit, setUnit] = useState();

  //modal
  const [isModalQtyOpen, setIsModalQtyOpen] = useState(false);
  const [isModalStokOpen, setIsModalStokOpen] = useState(false);

  //Edit
  const [tempVal, setTempVal] = useState();
  const [typeFuc, setTypeFuc] = useState();

  useEffect(() => {
    getItems().then((response) => {
      setReload(false);
    });
  }, [page, keyword, reload]);

  const getItems = async () => {
    const response = await axios.get(
      `http://localhost:5000/items?search=${keyword}&page=${page}&limit=&${limit}`
    );

    setItems(response.data.result);
    setPage(response.data.page);
    setPages(response.data.totalPage);
    setRows(response.data.totalRows);
  };

  const changePage = ({ selected }) => {
    setPage(selected);
  };

  const searchData = (e) => {
    e.preventDefault();
    setPage(0);
    setKeyword(query);
  };

  const addToCart = async () => {
    setIsModalQtyOpen(false);
    const updatedStokValue = tempVal - quantity;

    try {
      const updateRes = await axios.patch(
        `http://localhost:5000/items/${idItem}`,
        { stok: updatedStokValue }
      );
    } catch (error) {
      if (error.response) {
        console.log("Error response:");
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else {
        console.log("Error:", error.message);
      }
    }

    getItems();

    const newItem = {
      id: idItem,
      nama: nama,
      quantity: quantity,
      price: price,
    };

    setData((prevData) => [...prevData, newItem]);

    // Reset nilai input setelah ditambahkan ke cart
    setIdItem("");
    setNama("");
    setQuantity(1);
    setPrice(0);
    setTempVal();
    setUnit();
  };

  const openModalQty = async (id, stok) => {
    if (stok > 0) {
      const response = await axios.get(`http://localhost:5000/items/${id}`);

      // setUnit(response.data);

      setIdItem(response.data.id);
      setNama(response.data.name);
      setPrice(response.data.price);
      setTempVal(response.data.stok);

      setIsModalQtyOpen(true);
    } else {
      toast.error("Stok Kosong!!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const closeModalQty = () => {
    setIdItem("");
    setNama("");
    setQuantity(1);
    setPrice(0);
    setTypeFuc();
    setIsModalQtyOpen(false);
  };

  //Edit fungsion
  const SaveEdit = async () => {
    try {
      if (typeFuc == "stok") {
        // const updatedValue = stok;
        const stokEditRes = await axios.patch(
          `http://localhost:5000/items/${idItem}`,
          { stok: tempVal }
        );
        console.log(stokEditRes);
      } else if (typeFuc == "price") {
        const stokEditRes = await axios.patch(
          `http://localhost:5000/items/${idItem}`,
          { price: tempVal }
        );
        console.log(stokEditRes);
      }

      closeModalStok();
      setReload(true);
    } catch (error) {
      console.error(error);
      toast.error("Gagal menyimpan perbahan", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const openModalStok = async (id, tempVal, typeFuc) => {
    setIdItem(id);
    setTempVal(tempVal);
    setTypeFuc(typeFuc);
    setIsModalStokOpen(true);
  };

  const closeModalStok = () => {
    setTempVal(0);
    setIdItem();
    setTypeFuc();
    setIsModalStokOpen(false);
  };

  return (
    <div className="container mt-5 mx-3">
      <div className="columns">
        <div className="column is-centered">
          <form onSubmit={searchData}>
            <div className="field has-addons">
              <div className="control is-expanded">
                <input
                  type="text"
                  className="input"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search..."
                />
              </div>
              <div className="control">
                <button type="submit" className="button is-info">
                  Search
                </button>
              </div>
            </div>
          </form>
          <table className="table is-striped is-bordered is-fullwidth mt-2">
            <thead>
              <tr>
                <th>NO PART</th>
                <th>NAMA</th>
                <th>MODEL</th>
                <th>HARGA</th>
                <th>STOK</th>
                <th>ADD</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.noPart}</td>
                  <td>{item.name}</td>
                  <td>{item.model}</td>
                  <td>
                    {item.price}
                    <button
                      className="ml-3 button is-warning"
                      onClick={() =>
                        openModalStok(item.id, item.price, "price")
                      }
                    >
                      <span>
                        <AiOutlineEdit />
                      </span>
                    </button>
                  </td>
                  <td className="px-3 ">
                    {item.stok}
                    <button
                      className="ml-3 button is-warning"
                      onClick={() => openModalStok(item.id, item.stok, "stok")}
                    >
                      <span>
                        <AiOutlineEdit />
                      </span>
                    </button>
                  </td>
                  <td>
                    <button
                      className="button is-primary"
                      onClick={() => openModalQty(item.id, item.stok)}
                    >
                      <span>Add+</span>
                    </button>
                  </td>
                </tr>
              ))}
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
      </div>
      {/* Qty MOdal */}
      <Modal
        isOpen={isModalQtyOpen}
        onRequestClose={closeModalQty}
        className="modal is-active p-6"
        autoFocus={false}
      >
        <div className="modal-background"></div>
        <div className="modal-content has-text-centered">
          <h1 className="title has-text-light">Masukan Jumlah barang</h1>
          <div className="field">
            <label className="label">Quantity:</label>
            <div className="control">
              <input
                className="input"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    addToCart();
                  }
                }}
                autoFocus
              />
            </div>
          </div>
          <div className="field is-grouped is-grouped-right">
            <div className="control">
              <button className="button is-primary" onClick={addToCart}>
                Add to Cart
              </button>
            </div>
            <div className="control">
              <button className="button" onClick={closeModalQty}>
                Cancel
              </button>
            </div>
          </div>
        </div>
        <button
          className="modal-close is-large"
          aria-label="close"
          onClick={closeModalQty}
        ></button>
      </Modal>

      {/* Stok Edit Modal */}

      <Modal
        isOpen={isModalStokOpen}
        onRequestClose={closeModalQty}
        className="modal is-active p-6"
        autoFocus={false}
      >
        <div className="modal-background"></div>
        <div className="modal-content has-text-centered">
          <h1 className="title has-text-light">Masukkan {typeFuc} barang</h1>
          <div className="field">
            <div className="control">
              <input
                className="input"
                type="number"
                value={tempVal}
                onChange={(e) => setTempVal(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    SaveEdit();
                  }
                }}
                autoFocus
                onFocus={(e) => e.target.select()}
              />
            </div>
          </div>
          <div className="field is-grouped is-grouped-right">
            <div className="control">
              <button className="button is-primary" onClick={SaveEdit}>
                Save
              </button>
            </div>
            <div className="control">
              <button className="button" onClick={closeModalStok}>
                Cancel
              </button>
            </div>
          </div>
        </div>
        <button
          className="modal-close is-large"
          aria-label="close"
          onClick={closeModalStok}
        ></button>
      </Modal>

      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default ItemList;
