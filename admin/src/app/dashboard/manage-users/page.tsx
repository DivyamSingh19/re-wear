"use client";
import React, { useState } from "react";
import { User as UserIcon, Trash2, Eye, Check } from "lucide-react";
import { SearchBar } from "@/components/search-bar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  joinDate: string;
  isApproved: boolean;
}

export default function ManageUsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "User",
      status: "Active",
      joinDate: "2024-01-15",
      isApproved: false,
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Admin",
      status: "Active",
      joinDate: "2024-01-20",
      isApproved: false,
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      role: "User",
      status: "Inactive",
      joinDate: "2024-02-01",
      isApproved: false,
    },
    {
      id: 4,
      name: "Sarah Wilson",
      email: "sarah@example.com",
      role: "Moderator",
      status: "Active",
      joinDate: "2024-02-10",
      isApproved: false,
    },
  ]);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  const handleApprove = (id: number) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, isApproved: true } : user
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-50 py-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Manage Users</h1>

      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder="Search users..."
      />

      <div className="bg-white rounded-lg shadow-sm border overflow-x-auto lg:px-10">
        <table className="w-full min-w-[640px]">
          <thead className="bg-gray-50 border-b">
            <tr>
              {["User", "Role", "Status", "Join Date", "Actions"].map(
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
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                      <UserIcon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                      {user.isApproved && (
                        <div className="text-xs text-green-600 font-medium">
                          Approved
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                <td className="px-4 py-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-medium ${
                      user.role === "Admin"
                        ? "bg-red-100 text-red-800"
                        : user.role === "Moderator"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>

                <td className="px-4 py-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-medium ${
                      user.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>

                <td className="px-4 py-4 text-sm text-gray-900">
                  {user.joinDate}
                </td>

                <td className="px-4 py-4">
                  <div className="flex space-x-2">
                    <button
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded transition"
                      title="View"
                      onClick={() => {
                        setSelectedUser(user);
                        setDialogOpen(true);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      className="p-2 text-green-600 hover:bg-green-100 rounded transition"
                      title={user.isApproved ? "Approved" : "Approve"}
                      onClick={() => handleApprove(user.id)}
                      disabled={user.isApproved}
                    >
                      <Check
                        className={`w-4 h-4 ${
                          user.isApproved ? "opacity-50" : ""
                        }`}
                      />
                    </button>

                    <button
                      className="p-2 text-red-600 hover:bg-red-100 rounded transition"
                      title="Delete"
                      onClick={() => handleDelete(user.id)}
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

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setSelectedUser(null);
        }}
      >
        {selectedUser && (
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
              <DialogDescription>
                Here’s more info about the selected user.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <strong>Name:</strong> {selectedUser.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>Role:</strong> {selectedUser.role}
              </p>
              <p>
                <strong>Status:</strong> {selectedUser.status}
              </p>
              <p>
                <strong>Join Date:</strong> {selectedUser.joinDate}
              </p>
              <p>
                <strong>Approved:</strong>{" "}
                {selectedUser.isApproved ? "Yes" : "No"}
              </p>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
