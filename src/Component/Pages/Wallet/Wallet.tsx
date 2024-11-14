import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../../firebase/Firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

const Wallet: React.FC = () => {
    const [ balance, setBalance ] = useState<number>(0);
    const [ user ] = useAuthState(auth);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserBalance = async () => {
            if (user) {
                const q = query(collection(db, 'users'), where('uid', '==', user.uid));
                try {
                    const querySnapshot = await getDocs(q);
                    querySnapshot.forEach((doc) => {
                        setBalance(doc.data().balance);
                    });
                } catch (err) {
                    console.error("Failed to fetch user balance:", err);
                }
            }
        };

        fetchUserBalance();
    }, [user]);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const path = event.target.value;
        navigate(path);
    };

    return (
        <div>
            <select onChange={handleChange} defaultValue="">
                <option value="" disabled>Balance: ₹{balance}</option>
                <option value="/recharge">Recharge</option>
                <option value="/withdraw">Withdraw</option>
            </select>
        </div>
    );
};

export default Wallet;
