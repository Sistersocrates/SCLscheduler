import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthProvider";
import { createClass, uploadClassImage } from "../../lib/teacherFirebase";
import toast from 'react-hot-toast';
import { Upload, X } from "lucide-react";

const HOURS = [
  { id: 1, time: "9:00 - 9:45" },
  { id: 2, time: "9:45 - 10:30" },
  { id: 3, time: "10:30 - 11:15" },
  { id: 4, time: "11:15 - 12:00" },
  { id: 5, time: "12:30 - 1:20" },
  { id: 6, time: "1:20 - 2:15" },
  { id: 7, time: "2:15 - 3:05" },
];

const CreateClassModal = ({ isOpen, onClose, onClassCreated }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    room: "",
    capacity: 20,
    hour: 1,
    community_partner: "",
    notes: "",
  });

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        title: "",
        description: "",
        room: "",
        capacity: 20,
        hour: 1,
        community_partner: "",
        notes: "",
      });
      setImageFile(null);
      setImagePreview(null);
      setLoading(false);
    }
  }, [isOpen]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setImageFile(file);
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
        toast.error("You must be logged in.");
        return;
    }
    setLoading(true);
    const toastId = toast.loading('Creating class...');

    try {
      const classData = {
        ...formData,
        teacherName: user.displayName,
        teacherEmail: user.email,
      };
      const newClass = await createClass(user.uid, classData);

      if (imageFile) {
        await uploadClassImage(newClass.id, imageFile);
      }

      toast.success("Class created successfully", { id: toastId });
      onClassCreated();
      onClose();
    } catch (error) {
      console.error("Error creating class:", error);
      toast.error(error.message || "Failed to create class", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) : value,
    }));
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Create New Class</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                <X className="w-6 h-6" />
            </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hour *</label>
            <select name="hour" value={formData.hour} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              {HOURS.map((hour) => (<option key={hour.id} value={hour.id}>Hour {hour.id} ({hour.time})</option>))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class Image</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="Preview" className="max-h-48 rounded-md" />
                  <button type="button" onClick={removeImage} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"><X className="w-4 h-4" /></button>
                </div>
              ) : (
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                      <span>Upload an image</span>
                      <input type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
            <input type="text" name="room" value={formData.room} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Number of Students</label>
            <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} min="1" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Community Partner</label>
            <input type="text" name="community_partner" value={formData.community_partner} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} rows="2" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex gap-4 pt-4">
            <button type="submit" disabled={loading} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
              {loading ? "Creating..." : "Create Class"}
            </button>
            <button type="button" onClick={onClose} disabled={loading} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateClassModal;
