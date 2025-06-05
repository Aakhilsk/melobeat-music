import React from "react";
import { motion } from "framer-motion";
import SongList from "../components/SongsList";
import Playlists from "../components/Playlists";
import Player from "../components/Player";

function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-full flex flex-col"
    >
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-1 flex flex-col lg:flex-row gap-8 p-8 overflow-hidden"
      >
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full lg:w-3/5 overflow-y-auto custom-scrollbar p-6"
        >
          <SongList />
        </motion.div>
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full lg:w-2/5 overflow-y-auto custom-scrollbar p-8"
        >
          <Playlists />
        </motion.div>
      </motion.div>
      <Player />
    </motion.div>
  );
}

export default Home;
