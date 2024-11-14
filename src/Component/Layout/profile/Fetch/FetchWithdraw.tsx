import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../../firebase/Firebase';

interface Withdrawal {
  id: string;
  accno: string;
  ifsc: string;
  timestamp: any;
  withdrawalAmount: string;
}

const WithdrawalTable: React.FC = () => {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const querySnapshot = await getDocs(query(collection(db, "WithdrawalList")));
      const loadedWithdrawals: Withdrawal[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as Withdrawal
      }));
      setWithdrawals(loadedWithdrawals);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching withdrawal documents:", err);
      setError("Failed to load withdrawals.");
      setLoading(false);
    }
  };

  const handleDelete = async (docId: string) => {
    try {
      await deleteDoc(doc(db, "WithdrawalList", docId));
      setWithdrawals(prev => prev.filter(item => item.id !== docId));
    } catch (err) {
      console.error("Error deleting document:", err);
      alert("Failed to delete the document.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Withdrawal List</h1>
      <div className="max-h-[400px] overflow-auto">
        <table className="min-w-full table-auto text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Email</th>
              <th scope="col" className="px-6 py-3">Account Number</th>
              <th scope="col" className="px-6 py-3">IFSC</th>
              <th scope="col" className="px-6 py-3">Date</th>
              <th scope="col" className="px-6 py-3">Withdrawal Amount</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {withdrawals.map(({ id, accno, ifsc, timestamp, withdrawalAmount }) => (
              <tr key={id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4">{id.split('_')[0]}</td>
                <td className="px-6 py-4">{accno}</td>
                <td className="px-6 py-4">{ifsc}</td>
                <td className="px-6 py-4">{timestamp.toDate().toLocaleString()}</td>
                <td className="px-6 py-4">₹{parseFloat(withdrawalAmount).toFixed(2)}</td>
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
    </div>
  );
  
};

export default WithdrawalTable;
