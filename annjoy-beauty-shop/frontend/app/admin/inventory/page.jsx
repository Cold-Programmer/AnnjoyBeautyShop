"use client";

import { useState } from "react";

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState("View Stock");
  
  // Sample inventory data
  const [inventory, setInventory] = useState([
    { id: 1, name: "Wireless Mouse", sku: "WM-001", quantity: 45, price: 25.00 },
    { id: 2, name: "Mechanical Keyboard", sku: "MK-002", quantity: 8, price: 75.00 },
    { id: 3, name: "USB-C Hub", sku: "UC-003", quantity: 15, price: 30.00 },
    { id: 4, name: "HD Monitor", sku: "HM-004", quantity: 3, price: 180.00 },
  ]);

  // Sample history data
  const [history, setHistory] = useState([
    { id: 1, action: "Added Stock", item: "Wireless Mouse", qty: 20, date: "2026-06-10" },
    { id: 2, action: "Updated Stock", item: "Mechanical Keyboard", qty: -2, date: "2026-06-12" },
  ]);

  // Form states for adding/updating
  const [newItemName, setNewItemName] = useState("");
  const [newItemSku, setNewItemSku] = useState("");
  const [newItemQty, setNewItemQty] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");

  const handleAddStock = (e) => {
    e.preventDefault();
    if (!newItemName || !newItemQty) return;
    
    const addedQty = parseInt(newItemQty, 10);
    const newProduct = {
      id: Date.now(),
      name: newItemName,
      sku: newItemSku || `SKU-${Math.floor(Math.random() * 1000)}`,
      quantity: addedQty,
      price: parseFloat(newItemPrice) || 0,
    };

    setInventory([...inventory, newProduct]);
    setHistory([
      { id: Date.now(), action: "Added Stock", item: newItemName, qty: addedQty, date: new Date().toISOString().split("T")[0] },
      ...history,
    ]);

    setNewItemName("");
    setNewItemSku("");
    setNewItemQty("");
    setNewItemPrice("");
    setActiveTab("View Stock");
  };

  const handleUpdateQuantity = (id, change) => {
    setInventory(
      inventory.map((item) => {
        if (item.id === id) {
          const updatedQty = Math.max(0, item.quantity + change);
          return { ...item, quantity: updatedQty };
        }
        return item;
      })
    );
  };

  const lowStockItems = inventory.filter((item) => item.quantity < 10);

  const buttons = [
    "View Stock",
    "Add Stock",
    "Update Stock",
    "Low Stock Alerts",
    "Stock History",
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-bold">Inventory</h1>
      <p className="mt-3 text-gray-600">
        Manage inventory and stock levels seamlessly.
      </p>

      {/* Interactive Action Buttons */}
      <div className="mt-6 flex flex-wrap gap-3">
        {buttons.map((btn) => (
          <button
            key={btn}
            onClick={() => setActiveTab(btn)}
            className={`rounded-lg px-4 py-2 font-medium transition ${
              activeTab === btn
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {btn}
            {btn === "Low Stock Alerts" && lowStockItems.length > 0 && (
              <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                {lowStockItems.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Dynamic Content Area */}
      <div className="mt-8 rounded-xl border bg-white p-6 shadow">
        <h2 className="text-xl font-semibold">{activeTab}</h2>

        {/* View Stock Tab */}
        {activeTab === "View Stock" && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-600">
                  <th className="p-3">Item Name</th>
                  <th className="p-3">SKU</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Price</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{item.name}</td>
                    <td className="p-3 text-gray-500">{item.sku}</td>
                    <td className="p-3">
                      <span
                        className={`inline-block rounded px-2 py-1 text-sm font-semibold ${
                          item.quantity < 10
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {item.quantity} units
                      </span>
                    </td>
                    <td className="p-3">${item.price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Stock Tab */}
        {activeTab === "Add Stock" && (
          <form onSubmit={handleAddStock} className="mt-6 max-w-lg space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Item Name</label>
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                required
                className="mt-1 w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none"
                placeholder="e.g. Wireless Mouse"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">SKU</label>
              <input
                type="text"
                value={newItemSku}
                onChange={(e) => setNewItemSku(e.target.value)}
                className="mt-1 w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none"
                placeholder="e.g. WM-005"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Initial Quantity</label>
              <input
                type="number"
                value={newItemQty}
                onChange={(e) => setNewItemQty(e.target.value)}
                required
                min="1"
                className="mt-1 w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none"
                placeholder="e.g. 50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(e.target.value)}
                className="mt-1 w-full rounded-md border p-2 focus:border-blue-500 focus:outline-none"
                placeholder="e.g. 29.99"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Save New Stock
            </button>
          </form>
        )}

        {/* Update Stock Tab */}
        {activeTab === "Update Stock" && (
          <div className="mt-4 overflow-x-auto">
            <p className="text-sm text-gray-500 mb-4">Quickly adjust current stock quantities up or down.</p>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-600">
                  <th className="p-3">Item Name</th>
                  <th className="p-3">Current Quantity</th>
                  <th className="p-3">Quick Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{item.name}</td>
                    <td className="p-3">{item.quantity}</td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, -1)}
                        className="rounded bg-red-100 px-3 py-1 text-sm font-semibold text-red-600 hover:bg-red-200"
                      >
                        -
                      </button>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, 1)}
                        className="rounded bg-green-100 px-3 py-1 text-sm font-semibold text-green-600 hover:bg-green-200"
                      >
                        +
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Low Stock Alerts Tab */}
        {activeTab === "Low Stock Alerts" && (
          <div className="mt-4">
            {lowStockItems.length === 0 ? (
              <p className="text-gray-500">All inventory levels are optimal! No low stock warnings.</p>
            ) : (
              <div className="space-y-3">
                {lowStockItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4">
                    <div>
                      <h4 className="font-semibold text-red-800">{item.name}</h4>
                      <p className="text-sm text-red-600">SKU: {item.sku} — Only {item.quantity} left in stock!</p>
                    </div>
                    <button
                      onClick={() => setActiveTab("Update Stock")}
                      className="rounded bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
                    >
                      Restock
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Stock History Tab */}
        {activeTab === "Stock History" && (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-600">
                  <th className="p-3">Date</th>
                  <th className="p-3">Action Type</th>
                  <th className="p-3">Item</th>
                  <th className="p-3">Quantity Changed</th>
                </tr>
              </thead>
              <tbody>
                {history.map((record) => (
                  <tr key={record.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-gray-500">{record.date}</td>
                    <td className="p-3 font-medium">{record.action}</td>
                    <td className="p-3">{record.item}</td>
                    <td className="p-3">
                      <span className={record.qty > 0 ? "text-green-600" : "text-red-600"}>
                        {record.qty > 0 ? `+${record.qty}` : record.qty}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}