import React, { useState, useEffect, useRef } from "react";
import { MdClose } from "react-icons/md";
import ReactToPrint from "react-to-print";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

const ListNota = ({ data, setData, setReload }) => {
  const [total, setTotal] = useState(0);
  const componentsRef = useRef();

  useEffect(() => {
    let newTotal = 0;
    data.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      newTotal += itemTotal;
    });
    setTotal(newTotal);
  }, [data]);

  const deleteItemOnArr = async (index) => {
    const response = await axios.get(
      `http://localhost:5000/items/${data[index].id}`
    );
    const newData = [...data];
    const itemStok = response.data.stok + parseFloat(data[index].quantity);
    const stokEditRes = await axios.patch(
      `http://localhost:5000/items/${data[index].id}`,
      { stok: itemStok }
    );

    console.log(stokEditRes);
    setReload(true);

    newData.splice(index, 1);
    setData(newData);
  };

  const deleteAllItem = async () => {
    if (data.length > 0) {
      await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const newData = [...data];
          for (const item of newData) {
            const response = await axios.get(
              `http://localhost:5000/items/${item.id}`
            );
            const itemStok = response.data.stok + parseFloat(item.quantity);
            const stokEditRes = await axios.patch(
              `http://localhost:5000/items/${item.id}`,
              { stok: itemStok }
            );
            console.log(stokEditRes);
          }
          setData([]);
          setReload(true);

          toast.success("Nota Berhasil Di Bersihkan!!", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
        }
      });
    } else {
      toast.success("Nota Berhasil Di Bersihkan!!", {
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

  const saveData = async () => {
    console.log("Saving data...");
    try {
      if (data.length > 0) {
        // const parseText = JSON.stringify(data);
        const notaSave = {
          item: data,
          catatan: "",
        };
        console.log("notaSave : " + notaSave.item);
        const response = await axios.post(
          "http://localhost:5000/nota",
          notaSave
        );
        console.log(response);

        toast.success("Nota Berhasil di simpan!", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        setData([]);
      } else {
        toast.error("Nota Kosong!!", {
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
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div>
      <div
        ref={componentsRef}
        className="container has-background-white mt-5 mb-0 px-6 py-6 is-fullwidth"
      >
        <div className="is-justify-content-space-between">
          <div className="has-text-centered">
            <h1 className="title mt-5 mb-0">Vintage Series Store</h1>
            <h1>Puri Losplos, Ploso, Jombang, Jawa Timur</h1>
          </div>
          <h3>
            ------------------------------------------------------------------------------
          </h3>
          <p>NOTA PEMBELIAN</p>
          <h3>
            ------------------------------------------------------------------------------
          </h3>
          {data && data.length > 0 ? (
            <table className="table ">
              <tbody>
                {data.map((item, index) => {
                  const itemTotal = item.price * item.quantity;
                  const formattedPrice = item.price.toLocaleString();
                  const formattedItemTotal = itemTotal.toLocaleString();
                  return (
                    <tr key={index}>
                      <td>
                        <button
                          className="button is-danger is-small"
                          onClick={() => deleteItemOnArr(index)}
                        >
                          <MdClose />
                        </button>
                      </td>
                      <td>{item.nama}</td>
                      <td>@{item.quantity}</td>
                      <td>{formattedPrice}</td>
                      <td>|</td>
                      <td>{formattedItemTotal}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p>Tidak Ada Item</p>
          )}
          <h3>
            ------------------------------------------------------------------------------
          </h3>
          <div className="has-text-right">
            <h2 className="is-expanded">TOTAL : {total.toLocaleString()}</h2>
          </div>
          <h3>
            ------------------------------------------------------------------------------
          </h3>
        </div>
      </div>
      <div className="buttons has-background-white is-justify-content-space-between px-5 pb-5">
        <div>
          <ReactToPrint
            trigger={() => (
              <button className="button is-primary font-Overpass">Print</button>
            )}
            content={() => componentsRef.current}
            documentTitle="Nota belanja"
            pageStyle="print"
            onBeforePrint={saveData} // Menggunakan properti onBeforePrint untuk memanggil fungsi saveData sebelum mencetak
          />

          <button
            className="button is-success font-Overpass"
            onClick={() => saveData()}
          >
            Save
          </button>
        </div>

        <button
          className="button is-danger font-Overpass"
          onClick={() => deleteAllItem()}
        >
          Clear All
        </button>
      </div>
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

export default ListNota;
