import React, { useState } from "react";
import "bulma/css/bulma.min.css";

const DateDropdownRow = ({ selectedDate, setSelectedDate, setSearch }) => {
  const years = Array.from({ length: 100 }, (_, index) => 2023 + index); // Array of years from 2023 to 1924
  const months = Array.from({ length: 12 }, (_, index) => index + 1); // Array of months from 1 to 12
  const days = Array.from({ length: 31 }, (_, index) => index + 1); // Array of days from 1 to 31

  const handleSelect = (event, field) => {
    setSelectedDate((prevSelectedDate) => ({
      ...prevSelectedDate,
      [field]: event.target.value,
    }));
  };

  const handleSearch = () => {
    setSearch(1);
  };

  return (
    <div style={{ display: "flex" }} className="p-5 ">
      <select
        className="mx-2 px-3 has-text-weight-bold"
        value={selectedDate.year}
        onChange={(e) => handleSelect(e, "year")}
      >
        <option value="">Tahun</option>
        {years.map((year) => (
          <option value={year} key={year}>
            {year}
          </option>
        ))}
      </select>

      <select
        className="mx-2 px-3 has-text-weight-bold"
        value={selectedDate.month}
        onChange={(e) => handleSelect(e, "month")}
      >
        <option value="">Bulan</option>
        {months.map((month) => (
          <option value={month} key={month}>
            {month}
          </option>
        ))}
      </select>

      <select
        className="mx-2 px-3 has-text-weight-bold"
        value={selectedDate.day}
        onChange={(e) => handleSelect(e, "day")}
      >
        <option value="">Tanggal</option>
        {days.map((day) => (
          <option value={day} key={day}>
            {day}
          </option>
        ))}
      </select>

      <div className="control">
        <button
          type="submit"
          className="button is-info"
          onClick={() => {
            handleSearch();
          }}
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default DateDropdownRow;
