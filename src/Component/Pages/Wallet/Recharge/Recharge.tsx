import React, { useState } from 'react';
import Header from '../../../Layout/Header/Header';
import Footer from '../../../Layout/footer/Footer';
import { db, auth, storage } from '../../../../firebase/Firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import logo from '../../../../assets/upilogo.png';
import { FaRegCopy } from "react-icons/fa6";
import Toast from '../../../../Component/Layout/toast/Toast';

const Recharge: React.FC = () => {
    const [selectedUpiIndex, setSelectedUpiIndex] = useState<number | null>(null);
    const [utrNumber, setUtrNumber] = useState<string>('');
    const [rechargeAmount, setRechargeAmount] = useState<number | null>(null);
    const [paymentProof, setPaymentProof] = useState<File | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const currentUser = auth.currentUser;

    const qrDetails = [
        { upiId: 'saran2002murugan-1@oksbi', name: 'Saravanan M' },
        // { upiId: 'mchinnadurai582@okicici', name: 'M Chinnadurai' },
        // { upiId: 'rockykodi88@oksbi', name: 'Rocky Kodi' },
    ];

    const rechargeOptions = [100, 200, 500, 1000, 2000, 2500, 3000, 5000, 10000, 25000, 50000, 100000];

    const handleUtrSubmit = async () => {
        if (selectedUpiIndex === null) {
            setToastMessage('Please select a UPI ID');
            return;
        }
        if (!utrNumber || utrNumber.length !== 12 || !/^\d{12}$/.test(utrNumber)) {
            setToastMessage('Please enter a valid 12-digit UTR number');
            return;
        }
        if (!rechargeAmount) {
            setToastMessage('Please select a recharge amount');
            return;
        }
        if (!paymentProof) {
            setToastMessage('Please upload the payment proof');
            return;
        }

        const userEmail = currentUser?.email;
        const timestamp = new Date();

        try {
            const storageRef = ref(storage, `RechargeList/${userEmail}/${paymentProof.name}`);
            await uploadBytes(storageRef, paymentProof);
            const proofURL = await getDownloadURL(storageRef);

            const docRef = doc(db, 'RechargeList', userEmail);
            await setDoc(docRef, {
                utrNumber: utrNumber.trim(),
                rechargeAmount,
                upiId: qrDetails[selectedUpiIndex].upiId,
                proofURL,
                timestamp
            }, { merge: false });

            setToastMessage('Recharge information sent successfully. Please wait 10 minutes to see the balance in your wallet.');
            setUtrNumber('');
            setRechargeAmount(null);
            setPaymentProof(null);
            setSelectedUpiIndex(null);
        } catch (error) {
            console.error("Error adding document: ", error);
            setToastMessage('Failed to save the recharge information.');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPaymentProof(e.target.files[0]);
        }
    };

    const handleCopy = () => {
        if (selectedUpiIndex !== null) {
            navigator.clipboard.writeText(qrDetails[selectedUpiIndex].upiId)
                .then(() => setToastMessage('UPI ID copied to clipboard'))
                .catch((err) => console.error('Failed to copy UPI ID: ', err));
        }
    };

    return (
        <>
        {/* grid grid-cols-3 md:grid-cols-3 gap-3 */}
            <Header />
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-gray-700 mb-6 mt-24">Recharge Your Wallet</h1>
                <div className="px-1  mb-6">
                    {qrDetails.map((qr, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedUpiIndex(index)}
                            className={`p-4 border rounded-lg focus:outline-none ${selectedUpiIndex === index ? 'border-blue-500' : 'border-gray-300'}`}>
                            <p className="text-lg text-gray-800">UPI</p>
                            <img src={logo} alt={`UPI logo ${index + 1}`} className="w-full h-auto " />
                        </button>
                    ))}
                </div>
                {selectedUpiIndex !== null && (
                    <div className="bg-white shadow-md border-2 rounded-lg p-4 mb-4 w-full">
                        <div className="flex items-center text-lg text-gray-800 mt-3 cursor-pointer" onClick={handleCopy} role="button" aria-label="Copy UPI ID">
                            <span>UPI ID: {qrDetails[selectedUpiIndex].upiId}</span>
                            <FaRegCopy className="ml-2" />
                        </div>
                        <p className="text-md text-gray-600 mt-2">Name: {qrDetails[selectedUpiIndex].name}</p>
                    </div>
                )}
                <div className="grid grid-cols-2 gap-4 mb-4 mt-5">
                    {rechargeOptions.map(amount => (
                        <button
                            key={amount}
                            onClick={() => setRechargeAmount(amount)}
                            className={`bg-white text-blue-700 border border-blue-300 hover:bg-blue-300 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${rechargeAmount === amount ? 'bg-blue-300' : ''}`}>
                            Recharge ₹{amount}
                        </button>
                    ))}
                </div>
                <div className="bg-white shadow-md border-2 m-1 mt-2 rounded-lg p-4 max-w-md">
                    <p className="text-sm text-red-600 mb-4">1. Select a UPI ID, enter the UTR number, choose a recharge amount, and upload the payment proof.</p>
                    <p className="text-sm text-red-600 mb-4">2. Deposits made 2 hours after the account removal from the site are valid & will be added to their wallets.</p>
                    <p className="text-sm text-red-600 mb-4">3. The site is not responsible for money deposited to old, inactive, or closed accounts.</p>
                    <p className="text-sm text-red-600 mb-4">4. After deposit, add your UTR and amount to receive the balance.</p>
                    <p className="text-sm text-red-600 mb-4">5. In case of account modification: payment valid for 1 hour only.</p>
                </div>
                <div className="flex flex-col items-center mt-10">
                <input
                        type="text"
                        placeholder="Selected Recharge Amount"
                        value={rechargeAmount !== null ? `₹${rechargeAmount}` : ''}
                        className="border border-gray-300 p-2 rounded-lg w-[325px] mt-4 bg-gray-100 cursor-not-allowed" />
                    <input
                        type="text"
                        placeholder="Enter UTR Number"
                        value={utrNumber}
                        onChange={(e) => setUtrNumber(e.target.value)}
                        className="border border-gray-300 p-2 rounded-lg w-[325px] mt-4" />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="border border-gray-300 p-2 rounded-lg w-[325px] mt-4" />
                    <button
                        onClick={handleUtrSubmit}
                        className="mt-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline sm:mb-10">
                        Submit
                    </button>
                </div>
                {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
            </div>
            <div className='mt-4'>
                <Footer />
            </div>
        </>
    );
};

export default Recharge;
