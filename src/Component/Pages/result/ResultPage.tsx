import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase/Firebase';
import { format } from 'date-fns';
import Header from '../../Layout/Header/Header';
import Footer from '../../Layout/footer/Footer';

interface ResultData {
  id: string;
  result: string;
}

const LotteryResults = () => {
  const [dailyResults, setDailyResults] = useState<ResultData[]>([]);
  const [weeklyResults, setWeeklyResults] = useState<ResultData[]>([]);
  const [monthlyResults, setMonthlyResults] = useState<ResultData[]>([]);

  useEffect(() => {
    const fetchResults = async (collectionName: string, setResults: React.Dispatch<React.SetStateAction<ResultData[]>>) => {
      try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        const results = querySnapshot.docs.map(doc => ({
          id: doc.id,
          result: doc.data().result,
        }));
        setResults(results);
      } catch (err) {
        console.error(`Error fetching ${collectionName} documents:`, err);
      }
    };

    Promise.all([
      fetchResults("Daily Result", setDailyResults),
      fetchResults("Weekly Result", setWeeklyResults),
      fetchResults("Monthly Result", setMonthlyResults),
    ]);
  }, []);

  const currentDate = format(new Date(), 'MMMM dd, yyyy');

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold text-center mb-6 mt-20">
          Lottery Results - <span className="text-2xl font-bold text-gray-600">{currentDate}</span>
        </h1>
        <div className="space-y-8">
          <ResultsSection title="Daily Results" results={dailyResults} />
          <ResultsSection title="Weekly Results" results={weeklyResults} />
          <ResultsSection title="Monthly Results" results={monthlyResults} />
        </div>
      </div>
      <Footer />
    </>
  );
};

const ResultsSection = ({ title, results }: { title: string, results: ResultData[] }) => (
  <div>
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document ID</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {results.map(({ id, result }) => (
          <tr key={id}>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{id}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default LotteryResults;
