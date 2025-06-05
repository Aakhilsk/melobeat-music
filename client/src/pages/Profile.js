import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import axios from "axios";
import toast from "react-hot-toast";
import { setUser } from "../redux/userSlice";

function Profile() {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(user?.profileImage || "");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    }
  };

  const onUpdateProfileImage = async () => {
    if (!profileImage) {
      toast.error("Please select an image to upload.");
      return;
    }

    try {
      dispatch(ShowLoading());
      const formData = new FormData();
      formData.append("profileImage", profileImage);
      formData.append("userId", user._id);

      const response = await axios.post("/api/users/update-profile-image", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      dispatch(HideLoading());

      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(setUser(response.data.data));
        navigate('/');
        // Revoke the object URL to free up memory
        if (profileImagePreview && profileImagePreview.startsWith("blob:")) {
          URL.revokeObjectURL(profileImagePreview);
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      toast.error("Something went wrong while uploading the image.");
      console.error(error);
       // Revoke the object URL on error as well
       if (profileImagePreview && profileImagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(profileImagePreview);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col p-8 text-white"
    >
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">Your Profile</h1>
      </motion.div>

      <div className="flex flex-col items-center gap-8">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-40 h-40 rounded-full overflow-hidden border-4 border-orange-500 shadow-lg"
        >
          <img 
            src={profileImagePreview || "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Portrait_Placeholder_Square.png/1200px-Portrait_Placeholder_Square.png"}
            alt="Profile Preview"
            className="w-full h-full object-cover"
          />
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="flex flex-col items-center gap-4">
          <h2 className="text-xl font-semibold">{user?.name.toUpperCase()}</h2>
          <p className="text-gray-400">{user?.email}</p>

          <input 
            type="file" 
            accept="image/*"
            onChange={handleFileChange} 
            className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600"
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 px-8 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg font-medium shadow-lg hover:shadow-orange-500/25 transition-all"
            onClick={onUpdateProfileImage}
            disabled={!profileImage}
          >
            Save Profile Image
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Profile; 