import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

function DefaultLayout({ children }) {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden"
    >
      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="flex-none header flex justify-between p-5 shadow-lg items-center bg-gradient-to-r from-gray-900 to-black border-b border-gray-800"
      >
        <motion.h1 
          whileHover={{ scale: 1.05 }}
          className='text-3xl ml-7 font-bold cursor-pointer' 
          onClick={() => { navigate('/') }}
        >
          <span className='bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent'>
            MELOBEAT
          </span>
          <span className='text-white ml-2'>MUSIC</span>
        </motion.h1>
        <motion.div 
          className='flex items-center gap-4'
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-full"
          >
            {user?.profileImage ? (
              <img 
                src={user.profileImage} 
                alt="Profile" 
                className="w-8 h-8 rounded-full object-cover border-2 border-orange-500"
              />
            ) : (
              <i className="ri-user-line text-orange-500"></i>
            )}
            <motion.h1 
              className='text-lg text-white cursor-pointer'
              onClick={() => navigate('/profile')}
              whileHover={{ scale: 1.05 }}
            >
              {user?.name.toUpperCase()}
            </motion.h1>
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.1, color: "#ef4444" }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-red-500/20 rounded-full transition-colors"
            onClick={() => {
              localStorage.removeItem('token');
              window.location.reload();
            }}
          >
            <i className="ri-logout-circle-r-line text-2xl text-white"></i>
          </motion.button>
        </motion.div>
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex-1 overflow-auto pb-128"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export default DefaultLayout;
