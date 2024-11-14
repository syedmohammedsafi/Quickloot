import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

function TicketData() {
  const [monthlyData, setMonthlyData] = useState<{ docName: string, ticket: number, email: string }[]>([]);
  const [dailyData, setDailyData] = useState<{ docName: string, ticket: number, email: string }[]>([]);
  const [weeklyData, setWeeklyData] = useState<{ docName: string, ticket: number, email: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore();

      const monthlyColRef = collection(db, "Monthly");
      const monthlySnapshot = await getDocs(monthlyColRef);
      const monthlyData = [];
      monthlySnapshot.forEach(doc => {
        const data = doc.data();
        Object.keys(data).forEach(key => {
          if (/^6\d{5}$/.test(key)) {
            const ticket = parseInt(key);
            monthlyData.push({ docName: doc.id, ticket, email: data[key] });
          }
        });
      });
      setMonthlyData(monthlyData);

      const dailyColRef = collection(db, "Daily");
      const dailySnapshot = await getDocs(dailyColRef);
      const dailyData = [];
      dailySnapshot.forEach(doc => {
        const data = doc.data();
        Object.keys(data).forEach(key => {
          if (/^6\d{5}$/.test(key)) {
            const ticket = parseInt(key);
            dailyData.push({ docName: doc.id, ticket, email: data[key] });
          }
        });
      });
      setDailyData(dailyData);

      const weeklyColRef = collection(db, "Weekly");
      const weeklySnapshot = await getDocs(weeklyColRef);
      const weeklyData = [];
      weeklySnapshot.forEach(doc => {
        const data = doc.data();
        Object.keys(data).forEach(key => {
          if (/^6\d{5}$/.test(key)) {
            const ticket = parseInt(key);
            weeklyData.push({ docName: doc.id, ticket, email: data[key] });
          }
        });
      });
      setWeeklyData(weeklyData);
    };

    fetchData();
  }, []);

  

  return (
    <div className="flex flex-col justify-around gap-8">
      <div className="w-full sm:w-full md:w-full sm:h-96  overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Monthly Ticket List</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border">Document</th>
              <th className="py-2 px-4 border">Ticket</th>
              <th className="py-2 px-4 border">Email</th>
            </tr>
          </thead>
          <tbody>
            {monthlyData.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                <td className="py-2 px-4 border">{item.docName}</td>
                <td className="py-2 px-4 border">{item.ticket}</td>
                <td className="py-2 px-4 border">{item.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="w-full sm:w-full md:w-full sm:h-96  overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Weekly Ticket List</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border">Document</th>
              <th className="py-2 px-4 border">Ticket</th>
              <th className="py-2 px-4 border">Email</th>
            </tr>
          </thead>
          <tbody>
            {weeklyData.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                <td className="py-2 px-4 border">{item.docName}</td>
                <td className="py-2 px-4 border">{item.ticket}</td>
                <td className="py-2 px-4 border">{item.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="w-full sm:w-full md:w-full sm:h-96  overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">Daily Ticket List</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border">Document</th>
              <th className="py-2 px-4 border">Ticket</th>
              <th className="py-2 px-4 border">Email</th>
            </tr>
          </thead>
          <tbody>
            {dailyData.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                <td className="py-2 px-4 border">{item.docName}</td>
                <td className="py-2 px-4 border">{item.ticket}</td>
                <td className="py-2 px-4 border">{item.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TicketData;
