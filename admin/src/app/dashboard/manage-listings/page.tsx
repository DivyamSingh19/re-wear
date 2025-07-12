"use client";
import React, { useState } from "react";
import { Edit, Trash2, Eye, Package, Check } from "lucide-react";
import { SearchBar } from "@/components/search-bar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Listing {
  id: number;
  title: string;
  category: string;
  price: string;
  status: string;
  views: number;
  isApproved?: boolean;
  image: string;
}

export default function ManageListingsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [editableListing, setEditableListing] = useState<Listing | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"view" | "edit">("view");

  const [listings, setListings] = useState<Listing[]>([
    {
      id: 1,
      title: "Wireless Headphones",
      category: "Electronics",
      price: "$99.99",
      status: "Active",
      views: 245,
      isApproved: false,
      image: "https://via.placeholder.com/300x200?text=Headphones",
    },
    {
      id: 2,
      title: "Running Shoes",
      category: "Sports",
      price: "$129.99",
      status: "Draft",
      views: 89,
      isApproved: false,
      image: "https://via.placeholder.com/300x200?text=Shoes",
    },
  ]);

  const filteredListings = listings.filter(
    (listing) =>
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = (id: number) => {
    setListings((prev) =>
      prev.map((listing) =>
        listing.id === id ? { ...listing, isApproved: true } : listing
      )
    );
  };

  const handleDelete = (id: number) => {
    setListings((prev) => prev.filter((listing) => listing.id !== id));
  };

  const handleEdit = (id: number) => {
    const listingToEdit = listings.find((l) => l.id === id);
    if (listingToEdit) {
      setSelectedListing(listingToEdit);
      setEditableListing({ ...listingToEdit });
      setDialogMode("edit");
      setDialogOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-50 py-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Manage Listings</h1>
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder="Search listings..."
      />

      <div className="bg-white rounded-lg shadow-sm border overflow-x-auto lg:px-10">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {[
                "Product",
                "Category",
                "Price",
                "Status",
                "Views",
                "Actions",
              ].map((head) => (
                <th
                  key={head}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredListings.map((listing) => (
              <tr key={listing.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <Package className="w-5 h-5 text-gray-400 mr-3" />
                    <div className="font-medium text-gray-900">
                      {listing.title}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {listing.category}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {listing.price}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      listing.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : listing.status === "Draft"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {listing.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {listing.views}
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      onClick={() => {
                        setSelectedListing(listing);
                        setDialogMode("view");
                        setDialogOpen(true);
                      }}
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 text-green-600 hover:bg-green-50 rounded"
                      onClick={() => handleApprove(listing.id)}
                      disabled={listing.isApproved}
                      title={listing.isApproved ? "Approved" : "Approve"}
                    >
                      <Check
                        className={`w-4 h-4 ${
                          listing.isApproved ? "opacity-50" : ""
                        }`}
                      />
                    </button>
                    <button
                      className="p-2 text-yellow-600 hover:bg-yellow-50 rounded"
                      onClick={() => handleEdit(listing.id)}
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                      onClick={() => handleDelete(listing.id)}
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

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setSelectedListing(null);
            setEditableListing(null);
            setDialogMode("view");
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "edit" ? "Edit Listing" : "Listing Details"}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === "edit"
                ? "Make changes to the listing."
                : "Here’s more info on the selected listing."}
            </DialogDescription>
          </DialogHeader>

          {dialogMode === "view" && selectedListing && (
            <div className="space-y-4 text-sm text-gray-700">
              <img
                src={selectedListing.image}
                alt={selectedListing.title}
                className="w-full max-h-64 object-cover rounded"
              />
              <p>
                <strong>Title:</strong> {selectedListing.title}
              </p>
              <p>
                <strong>Category:</strong> {selectedListing.category}
              </p>
              <p>
                <strong>Price:</strong> {selectedListing.price}
              </p>
              <p>
                <strong>Status:</strong> {selectedListing.status}
              </p>
              <p>
                <strong>Views:</strong> {selectedListing.views}
              </p>
            </div>
          )}

          {dialogMode === "edit" && editableListing && (
            <div className="space-y-3">
              <input
                type="text"
                value={editableListing.title}
                onChange={(e) =>
                  setEditableListing({
                    ...editableListing,
                    title: e.target.value,
                  })
                }
                className="w-full mt-1 px-3 py-2 border rounded"
                placeholder="Title"
              />
              <input
                type="text"
                value={editableListing.category}
                onChange={(e) =>
                  setEditableListing({
                    ...editableListing,
                    category: e.target.value,
                  })
                }
                className="w-full mt-1 px-3 py-2 border rounded"
                placeholder="Category"
              />
              <input
                type="text"
                value={editableListing.price}
                onChange={(e) =>
                  setEditableListing({
                    ...editableListing,
                    price: e.target.value,
                  })
                }
                className="w-full mt-1 px-3 py-2 border rounded"
                placeholder="Price"
              />
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Image URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={editableListing.image}
                  required
                  onChange={(e) =>
                    setEditableListing({
                      ...editableListing,
                      image: e.target.value,
                    })
                  }
                  className="w-full mt-1 px-3 py-2 border rounded"
                  placeholder="Enter image URL"
                />
                {editableListing.image && (
                  <img
                    src={editableListing.image}
                    alt="Preview"
                    className="w-full max-h-48 object-cover rounded border"
                  />
                )}
              </div>

              <select
                value={editableListing.status}
                onChange={(e) =>
                  setEditableListing({
                    ...editableListing,
                    status: e.target.value,
                  })
                }
                className="w-full mt-1 px-3 py-2 border rounded"
              >
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
                <option value="Inactive">Inactive</option>
              </select>

              <button
                onClick={() => {
                  if (!editableListing.image.trim()) {
                    alert("Image URL is required.");
                    return;
                  }
                  setListings((prev) =>
                    prev.map((l) =>
                      l.id === editableListing.id ? editableListing : l
                    )
                  );
                  setDialogOpen(false);
                  setDialogMode("view");
                  setEditableListing(null);
                }}
                className="w-full mt-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
