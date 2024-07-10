import React, { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { firestore } from './firebase.js';

const App = () => {
  const [fullSpots, setFullSpots] = useState(0);
  const [availableSpots, setAvailableSpots] = useState(6);
  const [availableCodes, setAvailableCodes] = useState('A01, A02, A03, B01, B02, B03');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load initial data from local storage
    const localData = JSON.parse(localStorage.getItem('parkingData'));
    if (localData) {
      setFullSpots(localData.fullSpots);
      setAvailableSpots(localData.availableSpots);
      setAvailableCodes(localData.availableCodes);
      setLoading(false);
    }

    const parkingSpotsRef = collection(firestore, 'parking');

    const unsubscribe = onSnapshot(parkingSpotsRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const fullSpotsCount = data.filter(spot => !spot.available).length;
      const availableSpotsCount = data.filter(spot => spot.available).length;
      const availableCodesList = data.filter(spot => spot.available).map(spot => spot.id).join(', ');

      setFullSpots(fullSpotsCount);
      setAvailableSpots(availableSpotsCount);
      setAvailableCodes(availableCodesList);

      // Save the latest data to local storage
      localStorage.setItem('parkingData', JSON.stringify({
        fullSpots: fullSpotsCount,
        availableSpots: availableSpotsCount,
        availableCodes: availableCodesList,
      }));

      // Apply class names based on the Firestore data
      data.forEach(spot => {
        const spotElement = document.getElementById(spot.id);
        if (spotElement) {
          spotElement.classList.remove('available', 'full');
          spotElement.classList.add(spot.available ? 'available' : 'full');
        }
      });

      setLoading(false);
    }, (error) => {
      console.error('Error fetching data from Firebase:', error);
      setError('Error fetching data from Firebase');
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex bg-gray-800 text-white p-4">
        <div className="text-2xl font-bold flex-1 text-center ml-36">
          Smart Car Parking System
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="bg-gray-800 text-white p-2">
          <div className="m-6 space-y-12">
            <div className="hidden md:flex justify-center space-x-16 items-center">
              <div className="text-center">
                <div className="text-lg">Area Penuh</div>
                <div className="status-value" id="full-spots">
                  {fullSpots}
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg">Area Tersedia</div>
                <div className="status-value" id="available-spots">{availableSpots}</div>
              </div>
            </div>
            <div className="text-center section">
              <div className="text-lg">Kode Area Tersedia</div>
              <div className="codes-value" id="available-codes">
                {availableSpots === 0 ? 'Parkiran Sudah Penuh' : availableCodes}
              </div>
            </div>
            <div className="flex justify-around items-center">
              <div className="flex items-center p-4">
                <div className="legend-color available"></div>
                <div className="ml-2 text-base">Area Parkiran Tersedia</div>
              </div>
              <div className="flex items-center p-4 section">
                <div className="legend-color full"></div>
                <div className="ml-2 text-base">Area Parkiran Penuh</div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-gray-100 p-4 min-vh-100">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="text-2xl">Loading...</div>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-full">
              <div className="text-2xl text-red-500">{error}</div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row h-full">
              <div className="flex flex-col w-full md:w-1/2">
                {['A01', 'A02', 'A03'].map(id => (
                  <div className="flex-1 p-2" key={id}>
                    <div className="parking-spot available" id={id}>{id}</div>
                  </div>
                ))}
              </div>
              <div className="divider hidden md:block h-100"></div>
              <div className="flex flex-col w-full md:w-1/2">
                {['B01', 'B02', 'B03'].map(id => (
                  <div className="flex-1 p-2" key={id}>
                    <div className="parking-spot available" id={id}>{id}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
