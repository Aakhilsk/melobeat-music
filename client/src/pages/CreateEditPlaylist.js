import React, { useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import { setUser, SetSelectedPlaylistForEdit, SetSelectedPlaylist } from "../redux/userSlice";
import Player from "../components/Player";

function CreateEditPlaylist() {
  const [name, setName] = React.useState("");
  const [selectedSongs, setSelectedSongs] = React.useState([]);
  const { allSongs, selectedPlaylistForEdit } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedPlaylistForEdit) {
      setName(selectedPlaylistForEdit.name);
      setSelectedSongs(selectedPlaylistForEdit.songs);
    }
  }, [selectedPlaylistForEdit]);

  const selectUnselectSong = (song) => {
    if (selectedSongs.find((s) => s._id === song._id)) {
      setSelectedSongs(selectedSongs.filter((s) => s._id !== song._id));
    } else {
      setSelectedSongs([...selectedSongs, song]);
    }
  };

  const onAdd = async () => {
    if (name.trim().length === 0 || selectedSongs.length === 0) {
      toast.error("Please fill all fields");
    } else {
      try {
        dispatch(ShowLoading());
        const response = await axios.post(
          "/api/songs/add-playlist",
          {
            name,
            songs: selectedSongs,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        dispatch(HideLoading());
        if (response.data.success) {
          toast.success("Playlist updated successfully");
          dispatch(setUser(response.data.data));
          dispatch(SetSelectedPlaylistForEdit(null));
          setName("");
          setSelectedSongs([]);
          navigate("/");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        dispatch(HideLoading());
        toast.error("Something went wrong");
      }
    }
  };

  const onEdit = async () => {
    if (name.trim().length === 0 || selectedSongs.length === 0) {
      toast.error("Please fill all fields");
    } else {
      try {
        dispatch(ShowLoading());
        const response = await axios.post(
          "/api/songs/update-playlist",
          {
            name,
            songs: selectedSongs,
            userId: selectedPlaylistForEdit.userId,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        dispatch(HideLoading());
        if (response.data.success) {
          toast.success("Playlist updated successfully");
          dispatch(setUser(response.data.data));
          dispatch(SetSelectedPlaylistForEdit(null));
          setName("");
          setSelectedSongs([]);
          navigate("/");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        dispatch(HideLoading());
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col"
    >
      <div className="flex-1 overflow-hidden flex flex-col p-8">
        {/* Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center gap-5 mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-3xl text-white hover:text-orange-500 transition-colors"
            onClick={() => navigate("/")}
          >
            <i className="ri-arrow-left-line"></i>
          </motion.button>
          <h1 className="text-2xl font-bold text-white">
            {selectedPlaylistForEdit ? "Edit Playlist" : "Create Playlist"}
          </h1>
        </motion.div>

        {/* Playlist Name Input */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <input
            type="text"
            placeholder="Playlist Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full max-w-md px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
          />
        </motion.div>

        {/* Selected Songs Count */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-4"
        >
          <h2 className="text-xl text-white">
            Selected Songs ({selectedSongs.length})
          </h2>
        </motion.div>

        {/* Songs Grid */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex-1 overflow-y-auto custom-scrollbar p-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allSongs.map((song, index) => {
              const isSelected = selectedSongs.find((s) => s._id === song._id);
              return (
                <motion.div
                  key={song._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-gradient-to-r from-orange-500/20 to-pink-500/20 border-2 border-orange-500' 
                      : 'bg-gray-800/50 border border-gray-700 hover:border-orange-500/50'
                  }`}
                  onClick={() => selectUnselectSong(song)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg overflow-hidden">
                      <img
                        src={song.thumbnail || "https://img.freepik.com/free-vector/abstract-flat-line-with-music-note-motion-shapes-pattern-cover-design-poster-banner-decoration_460848-15092.jpg"}
                        alt={song.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium truncate">{song.title}</h3>
                      <p className="text-gray-400 text-sm truncate">
                        {song.artist} • {song.album} • {song.year}
                      </p>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      isSelected ? 'bg-orange-500' : 'bg-gray-700'
                    }`}>
                      {isSelected && <i className="ri-check-line text-white"></i>}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex justify-end"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg font-medium shadow-lg hover:shadow-orange-500/25 transition-all"
            onClick={selectedPlaylistForEdit ? onEdit : onAdd}
          >
            {selectedPlaylistForEdit ? "Update Playlist" : "Create Playlist"}
          </motion.button>
        </motion.div>
      </div>

      {/* Floating Save Button */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-24 right-8 z-40"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full font-medium shadow-lg hover:shadow-orange-500/25 transition-all"
          onClick={selectedPlaylistForEdit ? onEdit : onAdd}
        >
          <i className="ri-save-line text-xl"></i>
          <span>{selectedPlaylistForEdit ? "Update Playlist" : "Save Playlist"}</span>
        </motion.button>
      </motion.div>

      <Player />
    </motion.div>
  );
}

export default CreateEditPlaylist;
