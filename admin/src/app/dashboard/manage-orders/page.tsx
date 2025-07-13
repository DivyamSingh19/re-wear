"use client";
import React, { useState } from "react";
import { Eye, Trash2, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SearchBar } from "@/components/search-bar";

interface Order {
  id: number;
  customer: string;
  item: string;
  amount: string;
  status: string;
  date: string;
  image: string;
}

export default function ManageOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1,
      customer: "Alice Johnson",
      item: "Headphones",
      amount: "$399.99",
      status: "Shipped",
      date: "2024-06-10",
      image: "/headphones.jpg",
    },
    {
      id: 2,
      customer: "Bob Smith",
      item: "Running Shoes",
      amount: "$129.99",
      status: "Processing",
      date: "2024-06-11",
      image: "/shoes.jpg",
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = (id: number) => {
    setOrders((prev) => prev.filter((order) => order.id !== id));
  };

  const filteredOrders = orders.filter((order) =>
    `${order.customer} ${order.item}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-50 py-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Manage Orders</h1>

      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder="Search orders..."
      />

      <div className="bg-white rounded-lg shadow-sm border overflow-x-auto lg:px-10">
        <table className="w-full min-w-[640px]">
          <thead className="bg-gray-50 border-b">
            <tr>
              {["Customer", "Item", "Amount", "Status", "Date", "Actions"].map(
                (head) => (
                  <th
                    key={head}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    {head}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 text-sm text-gray-900">
                  {order.customer}
                </td>
                <td className="px-4 py-4 text-sm text-gray-900">
                  {order.item}
                </td>
                <td className="px-4 py-4 text-sm font-medium text-gray-900">
                  {order.amount}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-medium ${
                      order.status === "Shipped"
                        ? "bg-green-100 text-green-800"
                        : order.status === "Processing"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-900">
                  {order.date}
                </td>
                <td className="px-4 py-4">
                  <div className="flex space-x-2">
                    <button
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded transition"
                      title="View"
                      onClick={() => {
                        setSelectedOrder(order);
                        setDialogOpen(true);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      className="p-2 text-red-600 hover:bg-red-100 rounded transition"
                      title="Delete"
                      onClick={() => handleDelete(order.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <div className="p-6 text-gray-500 text-center">
            No matching orders found.
          </div>
        )}
      </div>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setSelectedOrder(null);
        }}
      >
        {selectedOrder && (
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
              <DialogDescription>
                Here’s more info about the selected order.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 text-sm text-gray-700">
              <img
                src={selectedOrder.image}
                alt={selectedOrder.item}
                className="w-full h-auto max-h-64 object-cover rounded"
              />
              <p>
                <strong>Customer:</strong> {selectedOrder.customer}
              </p>
              <p>
                <strong>Item:</strong> {selectedOrder.item}
              </p>
              <p>
                <strong>Amount:</strong> {selectedOrder.amount}
              </p>
              <p>
                <strong>Status:</strong> {selectedOrder.status}
              </p>
              <p>
                <strong>Date:</strong> {selectedOrder.date}
              </p>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
