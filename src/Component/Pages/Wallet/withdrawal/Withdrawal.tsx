import React, { useState } from 'react';
import Header from '../../../Layout/Header/Header';
import Footer from '../../../Layout/footer/Footer';
import { db, auth } from '../../../../firebase/Firebase';
import { doc, setDoc } from 'firebase/firestore';
import img from "../../../../../src/assets/withdraw.png"

const Withdrawal: React.FC = () => {
    const [amount, setAmount] = useState('');
    const [accno, setAccno] = useState('');
    const [ifsc , setIfsc] = useState('');
    const currentUser = auth.currentUser;

     const handleWithdrawal = async () => {
        if (amount && currentUser?.email) {
            const userEmail = currentUser.email;
            const timestamp = new Date();
            try {
                const docRef = doc(db, 'WithdrawalList', `${userEmail}_${timestamp}`);
                await setDoc(docRef, {
                    withdrawalAmount: amount.trim(),
                    timestamp,
                    accno,
                    ifsc
                }, { merge: true });

                alert(`Withdrawal request for ₹${amount} Submitted SuccessFully.`);
            } catch (error) {
                console.error("Error adding document: ", error);
                alert('Failed to initiate withdrawal. Please try again.');
            }
        } else {
            alert('Please enter a valid details.');
        }
        setAmount('');
        setAccno('');
        setIfsc('');
    };

    return (
        <>
            <Header />
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <img src={ img } alt="" className='mt-16'/>
                <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold text-center mb-4">Withdraw Funds</h1>
                    <form onSubmit={e => { e.preventDefault(); handleWithdrawal(); }} className="space-y-6">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            className="w-full px-4 py-2 text-lg text-gray-700 bg-white border rounded-md focus:border-blue-500 focus:outline-none focus:ring" />
                        <input
                            value={accno}
                            onChange={(e) => setAccno(e.target.value)}
                            placeholder="Enter Bank Account Number"
                            className="w-full px-4 py-2 text-lg text-gray-700 bg-white border rounded-md focus:border-blue-500 focus:outline-none focus:ring" />
                        <input
                            value={ifsc}
                            onChange={(e) => setIfsc(e.target.value)}
                            placeholder="Enter IFSC Code"
                            className="w-full px-4 py-2 text-lg text-gray-700 bg-white border rounded-md focus:border-blue-500 focus:outline-none focus:ring" />
                        <button
                            type="submit"
                            className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-600 rounded-md hover:bg-indigo focus:outline-none focus:bg-blue-500">
                            Withdraw
                        </button>
                    </form>
                    <h1 className='text-semibold mt-4'><span className='text-red-600 font-bold m-1'>*</span>Your money will be credited within 6 - 12 hours and only credited after the details are correct</h1>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Withdrawal;