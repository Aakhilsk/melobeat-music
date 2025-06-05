// import React, { useEffect } from "react";
// 

// function AdminHome() {
//   
//   

//   useEffect(() => {
//     if(user)
//     {
//       if ((user?.isAdmin && !user.isAdmin) || !user?.isAdmin) {
//         navigate("/");
//       }
//     }
//   }, [user]);

//   return (
//     <div>
//       <div className="flex justify-between">
// 
//         <button
//           className="text-white bg-orange-500 py-2 px-5"
//           onClick={() => {
//             navigate("/admin/add-edit-song");
//           }}
//         >
//           Add Song
//         </button>
//       </div>

//     </div>
//   );
// }

// export default AdminHome;
import React from 'react'
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { HideLoading, ShowLoading } from "../../redux/alertsSlice";
import { SetAllSongs } from "../../redux/userSlice";
import { useDispatch } from "react-redux";

function AdminHome() {
    const [selectedSongForEdit, setSelectedSongForEdit] = React.useState(null);
    const { allSongs } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onDeleteSong = async (songId) => {
      try {
        dispatch(ShowLoading());
        const response = await axios.post("/api/admin/delete-song", { songId }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        dispatch(HideLoading());
        if (response.data.success) {
          toast.success(response.data.message);
          // Fetch updated song list
          const updatedSongsResponse = await axios.post("/api/songs/get-all-songs", {}, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          if (updatedSongsResponse.data.success) {
            dispatch(SetAllSongs(updatedSongsResponse.data.data));
          }
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        dispatch(HideLoading());
        toast.error("Something went wrong");
        console.log(error);
      }
    };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col"
    >
        <div className='flex justify-between items-center mb-8'>
        <h1 className="text-3xl text-white">All Songs</h1>
        <button
           className="text-white bg-orange-500 py-2 px-5 rounded-lg shadow-lg hover:bg-orange-600 transition-colors"
           onClick={() => {
             navigate("/admin/add-edit-song");
           }}
         >Add a Song</button>
        </div>
        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <table className="w-full text-white mt-5">
           <thead className="w-full sticky top-0 bg-gray-900/90 backdrop-blur-sm z-10">
             <tr>
               <th className="text-left p-2">Title</th>
               <th className="text-left p-2">Artist</th>
               <th className="text-left p-2">Album</th>
               <th className="text-left p-2">Year</th>
               <th className="text-left p-2">Duration</th>
               <th className="text-left p-2">Actions</th>
             </tr>
           </thead>
           <tbody>
             {allSongs.map((song) => (
               <tr key={song.id} className="border-b border-gray-700 hover:bg-gray-800 transition-colors">
                 <td className="p-2">{song.title}</td>
                 <td className="p-2">{song.artist}</td>
                 <td className="p-2">{song.album}</td>
                 <td className="p-2">{song.year}</td>
                 <td className="p-2">{song.duration}</td>
                 <td className="p-2">
                   <div className="flex items-center gap-2">
                     <motion.i
                       whileHover={{ scale: 1.1, color: "#f97316" }}
                       whileTap={{ scale: 0.9 }}
                       className="ri-pencil-line text-xl text-gray-500 cursor-pointer hover:text-orange-500 transition-colors"
                       onClick={() => {
                        //setSelectedSongForEdit(song); 
                        navigate("/admin/add-edit-song/?id=" + song._id);
                       }}
                     ></motion.i>
                     {/* Add delete functionality later */}
                     <motion.i
                       whileHover={{ scale: 1.1, color: "#ef4444" }}
                       whileTap={{ scale: 0.9 }}
                       className="ri-delete-bin-line text-xl text-gray-500 cursor-pointer hover:text-red-500 transition-colors"
                       onClick={() => {
                         // Implement delete functionality
                         onDeleteSong(song._id);
                       }}
                     ></motion.i>
                   </div>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
        </div>
    </motion.div>
  )
}

export default AdminHome