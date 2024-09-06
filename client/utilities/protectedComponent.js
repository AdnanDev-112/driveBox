'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ethers } from 'ethers';

const ProtectedComponent = (Component) => {
  const Auth = (props) => {
    const router = useRouter();
    const [resp, setResponse] = useState('Valid');

    useEffect(() => {
      const checkMetamask = async () => {
        if (typeof window.ethereum !== 'undefined') {
          try {
           
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const currentAddress = await signer.getAddress();
            const token = localStorage.getItem(currentAddress);
            if (token != null) {
                const response = await fetch('http://localhost:3000/api/verify', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
                });
                let newresponse = await response.json();
                setResponse(newresponse.message);
                if (response.status !== 200) {
                    window.localStorage.removeItem(currentAddress);
                    router.push('/');
                }
            }
            else {
              localStorage.clear();
                router.push('/');
            }
          } catch (err) {
            console.error(err);
          }
        }
      };

      checkMetamask();
    }, [resp, router]);

    return <Component {...props} />;
  };

  return Auth;
};

export default ProtectedComponent;
