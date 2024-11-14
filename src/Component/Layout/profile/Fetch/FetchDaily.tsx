import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../../firebase/Firebase';
import { format, isToday } from 'date-fns';

interface DocumentData {
  id: string;
  data: { [date: string]: Set<string> };
  total: number;
}

const DailyTable = () => {
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Daily"));
        const today = new Date();
        const docs = querySnapshot.docs.map(doc => {
          const rawData = doc.data();
          const processedData: { [date: string]: Set<string> } = {};
          let docTotal = 0;

          Object.entries(rawData).forEach(([key, value]) => {
            if (key === 'total') {
              docTotal = value as number;
            } else if (/^\d{13}$/.test(key)) {
              const date = new Date(parseInt(key));
              if (isToday(date)) {
                const formattedDate = format(date, 'yyyy-MM-dd');
                if (!processedData[formattedDate]) {
                  processedData[formattedDate] = new Set();
                }
                if (typeof value === 'string') {
                  processedData[formattedDate].add(value);
                }
              }
            }
          });

          return {
            id: doc.id,
            data: processedData,
            total: docTotal
          };
        });

        setDocuments(docs.filter(doc => Object.keys(doc.data).length > 0)); 
      } catch (err) {
        console.error("Error fetching documents:", err);
        setError(`Failed to load data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (documents.length === 0) return <div>No Tickets sold</div>;

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Daily Tickets Buyers List</h1>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {documents.map(({ id, data, total }) => (
            <tr key={id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {Object.entries(data).map(([date, values], idx) => (
                  <div key={idx}>
                    <ul>
                      {[...values].map((value, index) => <li key={index}>{value}</li>)}
                    </ul>
                  </div>
                ))}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DailyTable;
