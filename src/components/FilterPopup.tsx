// src/components/FilterPopup.tsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterGroup {
  title: string;
  items: string[];
}

const filterGroups: FilterGroup[] = [
  {
    title: "TSG RAN Radio Access Network",
    items: [
      "Radio Layer 1 (Physical layer)",
      "Radio layer 2 and Radio layer 3 Radio Resource Control",
      "UTRAN/E-UTRAN/NG-RAN architecture and related network interfaces",
      "Radio Performance and Protocol Aspects"
    ]
  },
  {
    title: "TSG SA Service & System Aspects",
    items: [
      "Services",
      "System Architecture and Services",
      "Security and Privacy",
      "Multimedia Codecs, Systems and Services"
    ]
  },
  {
    title: "TSG CT Core Network & Terminals",
    items: [
      "User Equipment to Core Network protocols",
      "Interworking with External Networks & Policy and Charging Control",
      "Core Network Protocols",
      "Smart Card Application Aspects"
    ]
  }
];

interface FilterPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FilterPopup({ isOpen, onClose }: FilterPopupProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleCheckboxChange = (item: string) => {
    setSelectedItems(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 15 }}
            className="bg-gradient-to-br from-purple-600 to-blue-500 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <motion.h2 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold mb-8 text-white text-center"
            >
              3GPP Specification Filters
            </motion.h2>
            {filterGroups.map((group, groupIndex) => (
              <motion.div 
                key={groupIndex} 
                className="mb-8 bg-white bg-opacity-20 rounded-xl p-6"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 * groupIndex }}
              >
                <h3 className="text-2xl font-semibold mb-4 text-white">{group.title}</h3>
                <div className="space-y-3">
                  {group.items.map((item, itemIndex) => (
                    <motion.div 
                      key={itemIndex} 
                      className="flex items-center"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <input
                        type="checkbox"
                        id={`checkbox-${groupIndex}-${itemIndex}`}
                        checked={selectedItems.includes(item)}
                        onChange={() => handleCheckboxChange(item)}
                        className="form-checkbox h-5 w-5 text-pink-500 transition duration-150 ease-in-out rounded"
                      />
                      <motion.label 
                        htmlFor={`checkbox-${groupIndex}-${itemIndex}`} 
                        className="ml-3 text-lg text-white"
                        animate={{
                          scale: selectedItems.includes(item) ? 1.05 : 1,
                          fontWeight: selectedItems.includes(item) ? 600 : 400
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        {item}
                      </motion.label>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
            <motion.div 
              className="flex justify-end mt-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}