import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  SetCurrentSong,
  SetCurrentSongIndex,
  SetSelectedPlaylist,
  SetIsPlaying,
} from "../redux/userSlice";

function SongsList() {
  const { currentSong, selectedPlaylist, allSongs } = useSelector(
    (state) => state.user
  );
  const [songsToPlay, setSongsToPlay] = React.useState([]);
  const dispatch = useDispatch();
  const [searchKey, setSearchKey] = React.useState("");

  useEffect(() => {
    if (selectedPlaylist) {
      if (
        selectedPlaylist &&
        selectedPlaylist.name === "All Songs" &&
        searchKey !== ""
      ) {
        const tempSongs = [];

        selectedPlaylist.songs.forEach((song) => {
          if (JSON.stringify(song).toLowerCase().includes(searchKey)) {
            tempSongs.push(song);
          }
        });

        setSongsToPlay(tempSongs);
      } else {
        setSongsToPlay(selectedPlaylist?.songs);
      }
    }
  }, [selectedPlaylist, searchKey]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-3"
    >
      <motion.div 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="pl-3 pr-6"
      >
        <motion.input
          whileFocus={{ scale: 1.02 }}
          type="text"
          placeholder="Search songs, artists, or albums..."
          className="rounded-lg w-full p-3 bg-gray-800 text-white border-2 border-gray-700 focus:outline-none focus:border-orange-500 transition-colors placeholder-gray-400"
          onFocus={() =>
            dispatch(
              SetSelectedPlaylist({
                name: "All Songs",
                songs: allSongs,
              })
            )
          }
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
        />
      </motion.div>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="overflow-y-scroll h-[54vh] p-3 border-t border-b border-gray-700 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
      >
        <AnimatePresence>
          {songsToPlay.map((song, index) => {
            const isPlaying = currentSong?._id === song._id;
            return (
              <motion.div
                key={song._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 165, 0, 0.1)" }}
                className={`p-4 text-white flex items-center justify-between cursor-pointer rounded-lg mb-2 transition-all ${
                  isPlaying
                    ? "bg-orange-500 bg-opacity-20 border-2 border-orange-500"
                    : "hover:bg-gray-800"
                }`}
                onClick={() => {
                  dispatch(SetCurrentSong(song));
                  dispatch(SetCurrentSongIndex(index));
                  dispatch(SetIsPlaying(true));
                }}
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    whileHover={{ rotate: 5 }}
                    className="w-12 h-12 rounded-lg overflow-hidden"
                  >
                    <img
                      src={song.thumbnail || "https://img.freepik.com/free-vector/abstract-flat-line-with-music-note-motion-shapes-pattern-cover-design-poster-banner-decoration_460848-15092.jpg"}
                      alt={song.title}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  <div>
                    <motion.h1 
                      className={`text-lg font-semibold ${isPlaying ? "text-orange-500" : "text-white"}`}
                    >
                      {song.title}
                    </motion.h1>
                    <motion.h2 className="text-sm text-gray-400">
                      {song.artist} • {song.album} • {song.year}
                    </motion.h2>
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="text-gray-400"
                >
                  {song.duration}
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default SongsList;