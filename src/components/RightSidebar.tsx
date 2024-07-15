 
// src/components/RightSidebar.tsx

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownTrayIcon } from '@heroicons/react/24/solid';
import FilterPopup from './FilterPopup';

export default function RightSidebar() {
  const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);

  return (
    <motion.div 
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-full bg-gradient-to-b from-gray-900 to-black p-3 flex flex-col"
    >
      <h2 className="text-3xl font-bold mb-6 text-white">3GPP-Groups</h2>
      <ul className="space-y-4 flex-grow">
        {['3GPP Portal', '3GPP Specification', '3GPP Introducing'].map((item, index) => (
          <motion.li key={item} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full text-left bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg hover:bg-opacity-20 text-white font-semibold py-3 px-4 rounded-lg transition duration-300 shadow-lg"
              onClick={() => {
                if (item === '3GPP Specification') {
                  setIsFilterPopupOpen(true);
                }
              }}
            >
              {item}
            </motion.button>
          </motion.li>
        ))}
      </ul>
      <div className="mt-auto">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition duration-300 shadow-lg"
        >
          <ArrowDownTrayIcon className="h-5 w-5 mr-2" /> Export to CSV
        </motion.button>
      </div>
      <FilterPopup isOpen={isFilterPopupOpen} onClose={() => setIsFilterPopupOpen(false)} />
    </motion.div>
  );
}