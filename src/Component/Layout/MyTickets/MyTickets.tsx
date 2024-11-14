import React, { useState, useEffect } from 'react';
import { auth } from '../../../firebase/Firebase';
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";

const MyTickets: React.FC = () => {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [userImages, setUserImages] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        fetchUserImages(user.uid);
      } else {
        setUser(null);
        setUserImages([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserImages = async (userId: string) => {
    try {
      const storage = getStorage();
      let userImagesUrls: string[] = [];

      const folderRef = ref(storage, `${userId}/`);
      const imageRefs = await listAll(folderRef);

      for (const itemRef of imageRefs.items) {
        const imageUrl = await getDownloadURL(ref(storage, itemRef.fullPath));
        userImagesUrls.push(imageUrl);
        console.log("Fetched URL: ", imageUrl);
      }

      setUserImages(userImagesUrls);
    } catch (error) {
      console.error('Error fetching user images:', error);
    }
  };


  const renderImages = () => {
    if (!user) {
      return <div className="text-center">Please log in to view your tickets</div>;
    }

    if (userImages.length === 0) {
      return <div className="text-center">Loading...</div>;
    }

    return (
      <div className="flex flex-wrap justify-center">
        {userImages.map((url, index) => (
          index > 0 && (
            <div key={index} className="m-4">
              <img src={url} alt={`User image ${index}`} />
            </div>
          )
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white shadow-md border-2 rounded-lg p-4 mb-4 w-full">
      {renderImages()}
    </div>
  );
};

export default MyTickets;
