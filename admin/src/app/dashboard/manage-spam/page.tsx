"use client";
import React, { useState } from "react";
import { Eye, Trash2, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { SearchBar } from "@/components/search-bar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Spam {
  id: number;
  reporter: string;
  content: string;
  type: string;
  severity: string;
  date: string;
  status: string;
}

export default function ManageSpamPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpam, setSelectedSpam] = useState<Spam | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [spamReports, setSpamReports] = useState<Spam[]>([
    {
      id: 1,
      reporter: "John Doe",
      content: "Suspicious listing detected",
      type: "Listing",
      severity: "High",
      date: "2024-03-15",
      status: "Pending",
    },
    {
      id: 2,
      reporter: "Jane Smith",
      content: "Fake user account",
      type: "User",
      severity: "Medium",
      date: "2024-03-14",
      status: "Reviewed",
    },
    {
      id: 3,
      reporter: "Mike Johnson",
      content: "Spam comments",
      type: "Comment",
      severity: "Low",
      date: "2024-03-13",
      status: "Resolved",
    },
    {
      id: 4,
      reporter: "Sarah Wilson",
      content: "Fraudulent order",
      type: "Order",
      severity: "High",
      date: "2024-03-12",
      status: "Pending",
    },
  ]);

  const filteredSpam = spamReports.filter(
    (report) =>
      report.reporter.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = (id: number) => {
    setSpamReports((prev) =>
      prev.map((report) =>
        report.id === id ? { ...report, status: "Reviewed" } : report
      )
    );
  };

  const handleDismiss = (id: number) => {
    setSpamReports((prev) =>
      prev.map((report) =>
        report.id === id ? { ...report, status: "Resolved" } : report
      )
    );
  };

  const handleDelete = (id: number) => {
    setSpamReports((prev) => prev.filter((report) => report.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-50 py-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Manage Spam</h1>
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder="Search spam reports..."
      />

      <div className="bg-white rounded-lg shadow-sm border overflow-x-auto lg:px-10">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Report
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Severity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredSpam.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-red-400 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">
                        Reporter: {report.reporter}
                      </div>
                      <div className="text-sm text-gray-500">
                        {report.content}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                    {report.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      report.severity === "High"
                        ? "bg-red-100 text-red-800"
                        : report.severity === "Medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {report.severity}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      report.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : report.status === "Reviewed"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {report.date}
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                      title="View"
                      onClick={() => {
                        setSelectedSpam(report);
                        setDialogOpen(true);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 text-green-600 hover:bg-green-100 rounded"
                      title="Approve"
                      onClick={() => handleApprove(report.id)}
                      disabled={report.status !== "Pending"}
                    >
                      <CheckCircle
                        className={`w-4 h-4 ${
                          report.status !== "Pending" ? "opacity-50" : ""
                        }`}
                      />
                    </button>
                    <button
                      className="p-2 text-yellow-600 hover:bg-yellow-100 rounded"
                      title="Dismiss"
                      onClick={() => handleDismiss(report.id)}
                      disabled={report.status !== "Pending"}
                    >
                      <XCircle
                        className={`w-4 h-4 ${
                          report.status !== "Pending" ? "opacity-50" : ""
                        }`}
                      />
                    </button>
                    <button
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                      title="Delete"
                      onClick={() => handleDelete(report.id)}
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
          if (!open) setSelectedSpam(null);
        }}
      >
        {selectedSpam && (
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Spam Report Details</DialogTitle>
              <DialogDescription>
                Here's more information about the selected report.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <strong>ID:</strong> {selectedSpam.id}
              </p>
              <p>
                <strong>Reporter:</strong> {selectedSpam.reporter}
              </p>
              <p>
                <strong>Content:</strong> {selectedSpam.content}
              </p>
              <p>
                <strong>Type:</strong> {selectedSpam.type}
              </p>
              <p>
                <strong>Severity:</strong> {selectedSpam.severity}
              </p>
              <p>
                <strong>Status:</strong> {selectedSpam.status}
              </p>
              <p>
                <strong>Date:</strong> {selectedSpam.date}
              </p>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
