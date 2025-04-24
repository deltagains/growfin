import React from "react";

const orderedColumns = [
  "next_price",
  "ts_sil",
  "average_price",
  "investment",
  "percent_increment",
  "net_investment",
  "stock_profit",
  "call_profit",
  "net_profit",
];

const columnLabels = {
  total_stocks: "Total Stocks",
  average_price: "Average Price",
  call_profit: "Call Profit",
  investment: "Investment",
  net_investment: "Net Investment",
  stock_profit: "Stock Profit",
  net_profit: "Net Profit",
  next_price: "Stock Price",
  ts_sil: "Total Stocks (Lots)",
  percent_increment: "Percent Increment",
};

export default function BuyingScheduleTable({ data }) {
  if (!data || data.length === 0) {
    return <div>No data available.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            {orderedColumns.map((col) => (
              <th
                key={col}
                className="border px-4 py-2 text-center font-bold text-white"
                style={{ backgroundColor: "rgb(4, 58, 152)" }}
              >
                {columnLabels[col] || col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50">
              {orderedColumns.map((col) => (
                <td key={col} className="border px-4 py-2 text-center">
                  {row[col]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
