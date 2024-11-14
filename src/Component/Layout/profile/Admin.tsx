import React, { useState, useEffect, useCallback } from 'react';
import { auth, db } from '../../../firebase/Firebase';
import { doc, updateDoc, setDoc, collection, getDocs, getDoc, deleteDoc } from 'firebase/firestore';
import FetchMonthly from './Fetch/FetchMonthly';
import FetchWeekly from './Fetch/FetchWeekly';
import FetchDaily from './Fetch/FetchDaily';
import ReferralTable from './Fetch/FetchReferrals';
import FetchTicketBuyers from './Fetch/FetchTicketBuyers';
import Footer from '../footer/Footer';
import WithdrawTable from './Fetch/FetchWithdraw';
import RechargeTable from './Fetch/FetchRecharge';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  country?: string;
  email?: string;
  mobile?: string;
  balance?: string;
  recharge?: string;
  withdrawal?: string;
  referrals?: string;
}

function AdminForm() {
  const [users, setUsers] = useState<User[]>([]);
  const userCollection = collection(db, 'users');
  const [editUserId, setEditUserId] = useState(null);
  const [newBalance, setNewBalance] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.email === "l0tteryapp2024@gmail.com") {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const updateUserBalance = async () => {
    const userDocRef = doc(db, "users", editUserId);
    try {
      await updateDoc(userDocRef, {
        balance: newBalance
      });
      alert("Balance updated successfully!");
      fetchUsers();
      setEditUserId(null);
    } catch (error) {
      console.error("Failed to update balance:", error);
      alert(`Failed to update balance! Error: ${error.message}`);
    }
  };

  const fetchUsers = useCallback(async () => {
    const querySnapshot = await getDocs(userCollection);
    const userData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
    setUsers(userData);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const deleteUser = async (userId: string) => {
    await deleteDoc(doc(userCollection, userId));
    fetchUsers();
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [currentDailyGame, setCurrentDailyGame] = useState('Ball buster');
  const [currentWeeklyGame, setCurrentWeeklyGame] = useState('Cascade');
  const [currentMonthlyGame, setCurrentMonthlyGame] = useState('Golden box');

  const [inputDailyValue, setInputDailyValue] = useState('');
  const [inputWeeklyValue, setInputWeeklyValue] = useState('');
  const [inputMonthlyValue, setInputMonthlyValue] = useState('');

  const Dailygames = ["Ball buster", "Bet & win", "Bet2nite", "Cash craze", "Cash splash", "Cash wave", "GoldRush", "Pockets Rockets", "Prize paradise", "Trick shots", "Viva victory"];
  const Weeklygames = ["Cascade", "Charmstrike", "Knock knock", "Power ball", "Power play", "Syndicate star", "Turkey shoot"];
  const Monthlygames = ["Golden box", "King&Queen", "Lot set", "Mega power", "Minted Millions", "Power swipe", "Rainbow Rise", "Shining treasure", "Silver foxes", "Winfinity"];

  const handleSubmit = async (collectionName, gameName, inputValue, setter) => {
    const gameDocRef = doc(db, collectionName, gameName);
    try {
      const docSnap = await getDoc(gameDocRef);
      const updateData = { result: inputValue };

      if (docSnap.exists()) {
        await updateDoc(gameDocRef, updateData);
      } else {
        await setDoc(gameDocRef, updateData);
      }
      alert('Update successful!');
      setter('');
    } catch (error) {
      console.error('Failed to update document:', error);
      alert(`Update failed! Error: ${error.message}`);
    }
  };

  return (
    <>
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 my-6">Quickloot Administration Panel</h1>

        <div className="flex justify-end my-4">
          <input
            type="text"
            placeholder="Search by email"
            value={searchQuery}
            onChange={handleSearchChange}
            className="border rounded p-2"
          />
        </div>

        <div className="bg-white rounded-lg shadow overflow-auto mx-auto max-w-2xl ">
          <div className="overflow-x-auto overflow-y-scroll h-80 relative shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="py-3 px-8">
                    Name
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Country
                  </th>
                  <th scope="col" className="py-3 px-16">
                    Email
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Mobile
                  </th>
                  <th scope="col" className="py-3 px-2">
                    Balance
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Recharge
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Withdrawal
                  </th>
                  <th scope="col" className="py-3 px-2">
                    Referrals
                  </th>
                  <th scope="col" className="py-3 px-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="py-4 px-6">
                      {user.name}
                    </td>
                    <td className="py-4 px-6">
                      {user.country}
                    </td>
                    <td className="py-4 px-2">
                      {user.email}
                    </td>
                    <td className="py-4 px-2">
                      {user.mobile}
                    </td>
                    <td className="flex flex-row py-4 px-6">
                      {user.balance}
                      <button
                        onClick={() => {
                          setEditUserId(user.id);
                          setNewBalance(user.balance || '');
                        }}
                        className="ml-4 text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline">
                        Edit
                      </button>
                    </td>
                    <td className="py-4 px-10">
                      {user.recharge}
                    </td>
                    <td className="py-4 px-12">
                      {user.withdrawal}
                    </td>
                    <td className="py-4 px-8">
                      {user.referrals}
                    </td>
                    <td className="py-4 px-6">
                      <button className="text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50" onClick={() => deleteUser(user.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {editUserId && (
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-bold text-lg">Update Balance</h3>
              <input
                type="text"
                value={newBalance}
                onChange={(e) => setNewBalance(e.target.value)}
                className="border rounded p-2 mt-2 w-full"
                placeholder="New Balance"
              />
              <button
                onClick={updateUserBalance}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
                Update
              </button>
              <button
                onClick={() => setEditUserId(null)}
                className="ml-2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-4">
                Cancel
              </button>
            </div>
          </div>
        )}
        <div className='my-5'>
          <FetchMonthly />
        </div>
        <div className='my-5'>
          <FetchWeekly />
        </div>
        <div className='my-5'>
          <FetchDaily />
        </div>
        <div className='my-5'>
          <FetchTicketBuyers />
        </div>
        <div className='my-5'>
          <ReferralTable />
        </div>
        <div className='my-5'>
          <RechargeTable />
        </div>
        <div className='my-5'>
          <WithdrawTable />
        </div>

        {/* Daily Lottery Result Form */}
        <div className="mt-8">
          <form className="bg-white rounded-lg shadow px-8 pt-6 pb-8 mb-4" onSubmit={(e) => {
            e.preventDefault();
            handleSubmit('Daily Result', currentDailyGame, inputDailyValue, setInputDailyValue);
          }}>
            <h2 className="block text-gray-700 text-xl font-bold mb-2">Daily Lottery Results</h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dailyGame">
                Select Game
              </label>
              <select
                id="dailyGame"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={currentDailyGame}
                onChange={(e) => setCurrentDailyGame(e.target.value)}>
                {Dailygames.map(game => (
                  <option key={game} value={game}>{game}</option>
                ))}
              </select>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dailyResult">
                Result
              </label>
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="dailyResult"
                placeholder="Enter result"
                value={inputDailyValue}
                onChange={(e) => setInputDailyValue(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                Submit Result
              </button>
            </div>
          </form>
        </div>

        {/* Weekly Lottery Result Form */}
        <div className="mt-8 items-center">
          <form className="bg-white rounded-lg shadow px-8 pt-6 pb-8 mb-4" onSubmit={(e) => {
            e.preventDefault();
            handleSubmit('Weekly Result', currentWeeklyGame, inputWeeklyValue, setInputWeeklyValue);
          }}>
            <h2 className="block text-gray-700 text-xl font-bold mb-2">Weekly Lottery Results</h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="weeklyGame">
                Select Game
              </label>
              <select
                id="weeklyGame"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={currentWeeklyGame}
                onChange={(e) => setCurrentWeeklyGame(e.target.value)}>
                {Weeklygames.map(game => (
                  <option key={game} value={game}>{game}</option>
                ))}
              </select>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="weeklyResult">
                Result
              </label>
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="weeklyResult"
                placeholder="Enter result"
                value={inputWeeklyValue}
                onChange={(e) => setInputWeeklyValue(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                Submit Result
              </button>
            </div>
          </form>
        </div>

        {/* Monthly Lottery Result Form */}
        <div className="mt-8">
          <form className="bg-white rounded-lg shadow px-8 pt-6 pb-8 mb-4" onSubmit={(e) => {
            e.preventDefault();
            handleSubmit('Monthly Result', currentMonthlyGame, inputMonthlyValue, setInputMonthlyValue);
          }}>
            <h2 className="block text-gray-700 text-xl font-bold mb-2">Monthly Lottery Results</h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="monthlyGame">
                Select Game
              </label>
              <select
                id="monthlyGame"
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={currentMonthlyGame}
                onChange={(e) => setCurrentMonthlyGame(e.target.value)}>
                {Monthlygames.map(game => (
                  <option key={game} value={game}>{game}</option>
                ))}
              </select>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="monthlyResult">
                Result
              </label>
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="monthlyResult"
                placeholder="Enter result"
                value={inputMonthlyValue}
                onChange={(e) => setInputMonthlyValue(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                Submit Result
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default AdminForm;
