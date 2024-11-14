import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase/Firebase';
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { FaRegCopy } from "react-icons/fa6";

interface ReferralProps {
    userId: string;
}

const Referral: React.FC<ReferralProps> = ({ userId }) => {
    const [copied, setCopied] = useState(false);
    const [referralCount, setReferralCount] = useState(0);
    const [lotteryNames, setLotteryNames] = useState<string[]>([]);

    useEffect(() => {
        if (!userId) return;

        const fetchReferralCount = async () => {
            try {
                const userRef = doc(db, "users", userId);
                const docSnap = await getDoc(userRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (typeof data.referrals === 'number') {
                        setReferralCount(data.referrals);
                    }
                }
            } catch (error) {
                console.error('Error fetching referral count:', error);
            }
        };

        fetchReferralCount();
    }, [userId]);

    useEffect(() => {
        const fetchNames = async () => {
            let collectionName = "";
            if (referralCount >= 50) {
                collectionName = "Monthly Result";
            } else if (referralCount >= 25) {
                collectionName = "Weekly Result";
            } else if (referralCount >= 10) {
                collectionName = "Daily Result";
            }

            if (collectionName) {
                try {
                    const lotteriesCol = collection(db, collectionName);
                    const snapshot = await getDocs(lotteriesCol);
                    const names = snapshot.docs.map(doc => doc.id);
                    setLotteryNames(names);
                } catch (error) {
                    console.error('Error fetching lottery names:', error);
                }
            } else {
                setLotteryNames([]);
            }
        };

        if (referralCount >= 10) {
            fetchNames();
        } else {
            setLotteryNames([]);
        }
    }, [referralCount]);

    const generateReferralLink = (): string => {
        const referralCode = generateReferralCode(userId);
        return `${window.location.origin}/signup/${referralCode}`;
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(generateReferralLink());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };
    
    const generateReferralCode = (userId: string): string => {
        return userId.slice(0,5);
    };

    return (
        <div>
            <input 
                type="text" 
                readOnly
                value={generateReferralLink()}
                onClick={copyToClipboard}
                className='w-full cursor-pointer'/>
            <button onClick={copyToClipboard}>
                {copied ? <span className='text-blue-300'>Copied</span> : <FaRegCopy className="ml-2" />}
            </button>
            {lotteryNames.length > 0 && (
                <div>
                    <p className="text-lg">Eligible Lottery Tickets:</p>
                    <ul>
                        {lotteryNames.map(name => (
                            <li key={name}>{name}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Referral;
