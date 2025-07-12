"use client";
import React, { useState } from "react";
import { Eye, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
      item: "Wireless Headphones",
      amount: "$99.99",
      status: "Shipped",
      date: "2024-06-10",
      image: "https://via.placeholder.com/300x200?text=Headphones",
    },
    {
      id: 2,
      customer: "Bob Smith",
      item: "Running Shoes",
      amount: "$129.99",
      status: "Processing",
      date: "2024-06-11",
      image: "https://via.placeholder.com/300x200?text=Shoes",
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDelete = (id: number) => {
    setOrders((prev) => prev.filter((order) => order.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Manage Orders</h1>

      <div className="bg-white rounded-lg shadow-sm border overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {["Customer", "Item", "Amount", "Status", "Date", "Actions"].map(
                (head) => (
                  <th
                    key={head}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {head}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">
                  {order.customer}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {order.item}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {order.amount}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
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
                <td className="px-6 py-4 text-sm text-gray-900">
                  {order.date}
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      onClick={() => {
                        setSelectedOrder(order);
                        setDialogOpen(true);
                      }}
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                      onClick={() => handleDelete(order.id)}
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Here's more info about the selected order.
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4 text-sm text-gray-700">
              <img
                src={selectedOrder.image}
                alt={selectedOrder.item}
                className="w-full max-h-64 object-cover rounded"
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
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
