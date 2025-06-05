import React, { useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  SetSelectedPlaylist,
  SetSelectedPlaylistForEdit,
  setUser,
} from "../redux/userSlice";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";

function Playlists() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, allSongs, selectedPlaylist } = useSelector(
    (state) => state.user
  );
  const allPlaylists = [
    {
      name: "All Songs",
      songs: allSongs,
    },
    ...user.playlists,
  ];

  const onDelete = async (name) => {
    try {
      dispatch(ShowLoading());
      const response = await axios.post(
        "/api/songs/delete-playlist",
        {
          name,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(HideLoading());
      if (response.data.success) {
        toast.success("Playlist deleted successfully");
        dispatch(
          SetSelectedPlaylist({
            name: "All Songs",
            songs: allSongs,
          })
        );
        dispatch(
          SetSelectedPlaylist({
            name: "All Songs",
            songs: allSongs,
          })
        );
        dispatch(setUser(response.data.data));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (!selectedPlaylist && allSongs.length > 0) {
      dispatch(SetSelectedPlaylist(allPlaylists[0]));
    }
  }, [selectedPlaylist, allSongs]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-full flex flex-col"
    >
      {/* Header */}
      <motion.div 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="flex-none flex text-white justify-between w-full items-center mb-4"
      >
        <motion.h1 
          className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent"
        >
          Your Playlists
        </motion.h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all flex items-center gap-2 shadow-lg"
          onClick={() => navigate("/create-edit-playlist")}
        >
          <i className="ri-add-line"></i>
          Create Playlist
        </motion.button>
      </motion.div>

      {/* Playlists List (Scrollable) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-64"
      >
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence>
            {allPlaylists?.map((playlist, index) => {
              const isSelected = playlist?.name === selectedPlaylist?.name;
              return (
                <motion.div
                  key={playlist.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className={`flex flex-col gap-4 p-4 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? "bg-gradient-to-br from-orange-500/20 to-pink-500/20 border-2 border-orange-500 shadow-lg"
                      : "bg-gray-800/50 hover:bg-gray-800 border-2 border-transparent hover:border-gray-700"
                  }`}
                  onClick={() => {
                    dispatch(SetSelectedPlaylist(playlist));
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <motion.div 
                        whileHover={{ rotate: 5 }}
                        className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-orange-500/20 to-pink-500/20 flex items-center justify-center"
                      >
                        <i className="ri-playlist-line text-2xl text-orange-500"></i>
                      </motion.div>
                      <div>
                        <motion.h1 
                          className={`text-xl font-bold ${
                            isSelected ? "text-orange-500" : "text-white"
                          }`}
                        >
                          {playlist?.name}
                        </motion.h1>
                        <motion.div 
                          className="flex items-center gap-2 text-gray-400 text-sm"
                          whileHover={{ scale: 1.05 }}
                        >
                          <i className="ri-music-2-line"></i>
                          <span>{playlist?.songs?.length} songs</span>
                        </motion.div>
                      </div>
                    </div>
                    <motion.div 
                      className="flex items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <motion.button
                        whileHover={{ scale: 1.1, color: "#ef4444" }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                        onClick={() => onDelete(playlist.name)}
                      >
                        <i className="ri-delete-bin-line text-xl"></i>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1, color: "#f97316" }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 hover:bg-orange-500/20 rounded-lg transition-colors"
                        onClick={() => {
                          dispatch(SetSelectedPlaylistForEdit(playlist));
                          navigate(`/create-edit-playlist`);
                        }}
                      >
                        <i className="ri-pencil-line text-xl"></i>
                      </motion.button>
                    </motion.div>
                  </div>

                  {playlist?.songs?.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex -space-x-2 ml-16"
                    >
                      {playlist.songs.slice(0, 3).map((song, idx) => (
                        <motion.img
                          key={idx}
                          whileHover={{ rotate: 5, y: -5 }}
                          src={song.thumbnail || "https://img.freepik.com/free-vector/abstract-flat-line-with-music-note-motion-shapes-pattern-cover-design-poster-banner-decoration_460848-15092.jpg"}
                          alt={song.title}
                          className="w-10 h-10 rounded-lg border-2 border-gray-800 object-cover shadow-lg"
                        />
                      ))}
                      {playlist.songs.length > 3 && (
                        <motion.div 
                          whileHover={{ scale: 1.1 }}
                          className="w-10 h-10 rounded-lg border-2 border-gray-800 bg-gray-700 flex items-center justify-center text-sm shadow-lg"
                        >
                          +{playlist.songs.length - 3}
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Playlists;
