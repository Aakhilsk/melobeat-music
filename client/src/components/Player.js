import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  SetCurrentSong,
  SetCurrentSongIndex,
  SetIsPlaying,
  SetCurrentTime,
} from "../redux/userSlice";

function Player() {
  const [volume, setVolume] = useState(0.5);
  const [shuffleOn, setShuffleOn] = useState(false);
  const [duration, setDuration] = useState(0);
  const dispatch = useDispatch();
  const { currentSong, currentSongIndex, allSongs, isPlaying, currentTime } =
    useSelector((state) => state.user);
  const audioRef = React.createRef();

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const onPlay = () => {
    audioRef.current.play();
    dispatch(SetIsPlaying(true));
  };

  const onPause = () => {
    audioRef.current.pause();
    dispatch(SetIsPlaying(false));
  };

  const onPrev = () => {
    if (currentSongIndex !== 0 && !shuffleOn) {
      dispatch(SetCurrentSongIndex(currentSongIndex - 1));
      dispatch(SetCurrentSong(allSongs[currentSongIndex - 1]));
    } else {
      const randomIndex = Math.floor(Math.random() * allSongs.length);
      dispatch(SetCurrentSongIndex(randomIndex));
      dispatch(SetCurrentSong(allSongs[randomIndex]));
    }
    dispatch(SetIsPlaying(true));
  };

  const onNext = () => {
    if (currentSongIndex !== allSongs.length - 1 && !shuffleOn) {
      dispatch(SetCurrentSongIndex(currentSongIndex + 1));
      dispatch(SetCurrentSong(allSongs[currentSongIndex + 1]));
    } else {
      const randomIndex = Math.floor(Math.random() * allSongs.length);
      dispatch(SetCurrentSongIndex(randomIndex));
      dispatch(SetCurrentSong(allSongs[randomIndex]));
    }
    dispatch(SetIsPlaying(true));
  };

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.load();
      audioRef.current.play();
    }
  }, [currentSong]);

  useEffect(() => {
    if (!currentSong && allSongs.length > 0) {
      dispatch(SetCurrentSong(allSongs[0]));
    }
  }, [allSongs]);

  useEffect(() => {
    if (currentTime) {
      audioRef.current.currentTime = currentTime;
    }
  }, []);

  const handleTimeUpdate = () => {
    dispatch(SetCurrentTime(audioRef.current.currentTime));
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    audioRef.current.currentTime = newTime;
    dispatch(SetCurrentTime(newTime));
  };

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-r from-gray-900 to-black border-t border-gray-800 shadow-2xl z-50"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Song Info */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-4 w-full md:w-1/3"
          >
            <motion.div
              whileHover={{ rotate: 5 }}
              className="relative w-16 h-16 rounded-lg overflow-hidden shadow-lg"
            >
              <img
                className="w-full h-full object-cover"
                src={currentSong?.thumbnail || "https://img.freepik.com/free-vector/abstract-flat-line-with-music-note-motion-shapes-pattern-cover-design-poster-banner-decoration_460848-15092.jpg"}
                alt="album cover"
              />
              {isPlaying && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/30 flex items-center justify-center"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-8 h-8 rounded-full bg-orange-500/80 flex items-center justify-center"
                  >
                    <i className="ri-music-2-line text-white"></i>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
            <div className="flex-1 min-w-0">
              <motion.h1 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-lg font-semibold text-white truncate"
              >
                {currentSong?.title || "No song selected"}
              </motion.h1>
              <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-gray-400 truncate"
              >
                {currentSong?.artist} • {currentSong?.album} • {currentSong?.year}
              </motion.h2>
            </div>
          </motion.div>

          {/* Player Controls */}
          <div className="flex flex-col items-center gap-2 w-full md:w-1/3">
            <audio
              src={currentSong?.src}
              ref={audioRef}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={onNext}
            ></audio>
            
            <div className="flex items-center gap-6">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`text-2xl text-white hover:text-orange-500 transition-colors ${
                  shuffleOn ? "text-orange-500" : ""
                }`}
                onClick={() => setShuffleOn(!shuffleOn)}
              >
                <i className="ri-shuffle-line"></i>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-3xl text-white hover:text-orange-500 transition-colors"
                onClick={onPrev}
              >
                <i className="ri-skip-back-fill"></i>
              </motion.button>

              <AnimatePresence mode="wait">
                {isPlaying ? (
                  <motion.button
                    key="pause"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center text-white shadow-lg"
                    onClick={onPause}
                  >
                    <i className="ri-pause-fill text-2xl"></i>
                  </motion.button>
                ) : (
                  <motion.button
                    key="play"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center text-white shadow-lg"
                    onClick={onPlay}
                  >
                    <i className="ri-play-fill text-2xl"></i>
                  </motion.button>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-3xl text-white hover:text-orange-500 transition-colors"
                onClick={onNext}
              >
                <i className="ri-skip-forward-fill"></i>
              </motion.button>
            </div>

            {/* Enhanced Progress Bar */}
            <div className="flex items-center gap-3 w-full group">
              <span className="text-sm text-gray-400 min-w-[45px] text-right">
                {formatTime(currentTime)}
              </span>
              <div className="relative flex-1 h-1 bg-gray-700 rounded-full overflow-hidden group-hover:h-2 transition-all duration-200">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-500 to-pink-500"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
                <motion.input
                  type="range"
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  min={0}
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                />
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ left: `${(currentTime / duration) * 100}%` }}
                />
              </div>
              <span className="text-sm text-gray-400 min-w-[45px]">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Enhanced Volume Control */}
          <div className="flex items-center gap-3 w-full md:w-1/3 justify-end">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-xl text-white hover:text-orange-500 transition-colors"
              onClick={() => {
                setVolume(0);
                audioRef.current.volume = 0;
              }}
            >
              {volume === 0 ? (
                <i className="ri-volume-mute-line"></i>
              ) : volume < 0.5 ? (
                <i className="ri-volume-down-line"></i>
              ) : (
                <i className="ri-volume-up-line"></i>
              )}
            </motion.button>
            <div className="relative w-24 h-1 bg-gray-700 rounded-full overflow-hidden group">
              <motion.div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-500 to-pink-500"
                style={{ width: `${volume * 100}%` }}
              />
              <motion.input
                type="range"
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => {
                  const newVolume = parseFloat(e.target.value);
                  audioRef.current.volume = newVolume;
                  setVolume(newVolume);
                }}
              />
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ left: `${volume * 100}%` }}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-xl text-white hover:text-orange-500 transition-colors"
              onClick={() => {
                setVolume(1);
                audioRef.current.volume = 1;
              }}
            >
              <i className="ri-volume-up-line"></i>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Player;
