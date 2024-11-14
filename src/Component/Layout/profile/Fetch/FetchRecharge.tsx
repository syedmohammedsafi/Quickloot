import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../../firebase/Firebase';

interface Recharge {
  id: string;
  rechargeAmount: number;
  timestamp: any;
  utrNumber: string;
  proofURL: string;
}

const RechargeTable: React.FC = () => {
  const [recharges, setRecharges] = useState<Recharge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showImagePopup, setShowImagePopup] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string>('');

  useEffect(() => {
    fetchRecharges();
  }, []);

  const fetchRecharges = async () => {
    try {
      const querySnapshot = await getDocs(query(collection(db, "RechargeList")));
      const loadedRecharges: Recharge[] = querySnapshot.docs.map(doc => ({
        ...doc.data() as Recharge,
        id: doc.id
      }));
      setRecharges(loadedRecharges);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching recharge documents:", err);
      setError("Failed to load recharges.");
      setLoading(false);
    }
  };

  const handleDelete = async (docId: string) => {
    try {
      await deleteDoc(doc(db, "RechargeList", docId));
      setRecharges(prev => prev.filter(item => item.id !== docId));
    } catch (err) {
      console.error("Error deleting document:", err);
      alert("Failed to delete the document.");
    }
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setShowImagePopup(true);
  };

  const handleCloseImagePopup = () => {
    setShowImagePopup(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Recharge List</h1>
      <div className="max-h-[400px] overflow-auto">
        <table className="min-w-full table-auto text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Email</th>
              <th scope="col" className="px-6 py-3">Recharge Amount</th>
              <th scope="col" className="px-6 py-3">Timestamp</th>
              <th scope="col" className="px-6 py-3">UTR Number</th>
              <th scope="col" className="px-6 py-3">Proof</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {recharges.map(({ id, rechargeAmount, timestamp, utrNumber, proofURL }) => (
              <tr key={id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4">{id}</td>
                <td className="px-6 py-4">{rechargeAmount}</td>
                <td className="px-6 py-4">{timestamp.toDate().toLocaleString()}</td>
                <td className="px-6 py-4">{utrNumber}</td>
                <td className="px-6 py-4">
                  <img
                    src={proofURL}
                    alt=""
                    className="h-12 w-12 object-cover cursor-pointer"
                    onClick={() => handleImageClick(proofURL)}
                  />                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(id)}
                    className="text-red-500 hover:text-red-700">Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showImagePopup && (
        <div className="fixed top-24 w-3/4 h-3/4 flex sm:left-44 items-center justify-center bg-slate-950 bg-opacity-75">
          <div className="relative max-w-3xl mx-auto">
            <button
              onClick={handleCloseImagePopup}
              className="absolute top-4 right-4 text-red-600 text-lg focus:outline-none">
              close
            </button>
            <img src={selectedImage} alt="" className="max-w-full max-h-full sm:w-[300px] sm:h-[480px]" />
          </div>
        </div>
      )}
    </div>
  );
};

export default RechargeTable;
