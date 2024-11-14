import React, { useEffect, useState } from 'react';
import { collection, getDocs, FirestoreDataConverter, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '../../../../firebase/Firebase';  // Adjust the import path as per your project structure

type ReferralData = {
  [key: string]: any;
};

const referralConverter: FirestoreDataConverter<ReferralData> = {
  toFirestore(referralData: ReferralData): firebase.default.firestore.DocumentData {
    return referralData;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): ReferralData {
    const data = snapshot.data();
    return data as ReferralData;
  }
};

const ReferralTable: React.FC = () => {
  const [referrals, setReferrals] = useState<ReferralData[]>([]);

  useEffect(() => {
    const fetchReferrals = async () => {
      const querySnapshot = await getDocs(collection(db, "ReferralList").withConverter(referralConverter));
      const referralList: ReferralData[] = [];
      querySnapshot.forEach((doc) => {
        referralList.push({ id: doc.id, ...doc.data() });
      });
      setReferrals(referralList);
    };

    fetchReferrals();
  }, []);

  return (
    <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
      <h1 className='text-2xl font-semibold text-gray-800 mb-4'>Referrals List</h1>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          {referrals.length > 0 && (
            <tr>
              <th scope="col" className="py-3 px-6">
                Document Name
              </th>
              {Object.keys(referrals[0]).map((key, index) => (
                key !== 'id' && <th key={index} scope="col" className="py-3 px-6">
                  {key.replace('_', ' ')}
                </th>
              ))}
            </tr>
          )}
        </thead>
        <tbody>
          {referrals.map((referral, index) => (
            <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <td className="py-4 px-6">{referral.id}</td>
              {Object.keys(referral).map((key, idx) => (
                key !== 'id' && (
                  <td key={idx} className="py-4 px-6">
                    {key === 'myreferrals' && Array.isArray(referral[key]) ?
                      referral[key].map((email, emailIndex) => (
                        <div key={emailIndex}>{email}</div>
                      ))
                      :
                      referral[key]
                    }
                  </td>
                )
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {referrals.length === 0 && <p className="p-4">No referral found</p>}
    </div>
  );
  
};

export default ReferralTable;
