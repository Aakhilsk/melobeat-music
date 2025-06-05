import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { useDispatch } from "react-redux";
import { motion } from 'framer-motion';
import { HideLoading, ShowLoading } from "../redux/alertsSlice";
import toast from 'react-hot-toast';

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const register = async () => {
    try {
      dispatch(ShowLoading());
      const response = await axios.post("/api/users/register", user);
      dispatch(HideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/login");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
      dispatch(HideLoading());
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-6xl w-full"
      >
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full md:w-1/2 flex justify-center"
        >
          <motion.img
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ 
              scale: 1,
              rotate: 0,
              transition: {
                type: "spring",
                stiffness: 260,
                damping: 20
              }
            }}
            whileHover={{ 
              scale: 1.1,
              rotate: 5,
              transition: {
                type: "spring",
                stiffness: 400,
                damping: 10
              }
            }}
            className="h-[350px] w-[350px] object-contain"
            src="https://img.icons8.com/doodle/100/apple-music--v2.png"
            alt="Apple Music Icon"
          />
        </motion.div>

        <motion.div 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full md:w-1/2 flex flex-col gap-6 p-8 bg-gray-800/50 rounded-2xl backdrop-blur-sm border border-gray-700"
        >
          <div className="text-center mb-6">
            <motion.h1 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent"
            >
              Join Melobeat Music
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 mt-2"
            >
              Create your account and start your musical journey
            </motion.p>
          </div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <label className="text-gray-400">Full Name</label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                placeholder="Enter your full name"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-gray-400">Email</label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="email"
                placeholder="Enter your email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-gray-400">Password</label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="password"
                placeholder="Create a password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                className="w-full p-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={register}
              className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold hover:from-orange-600 hover:to-pink-600 transition-all mt-4"
            >
              Create Account
            </motion.button>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-4"
            >
              <span className="text-gray-400">Already have an account? </span>
              <Link 
                to="/login" 
                className="text-orange-500 hover:text-orange-400 font-semibold transition-colors"
              >
                Sign In
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Register;
