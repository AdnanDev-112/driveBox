'use client';
import { useState,useEffect } from 'react';
import { FaceLivenessDetector } from '@aws-amplify/ui-react-liveness';
import { Loader } from '@aws-amplify/ui-react';
import { ThemeProvider } from '@aws-amplify/ui-react';

import '@aws-amplify/ui-react/styles.css';

import { Amplify } from 'aws-amplify';
import awsexports from '../../../../src/aws-exports';

Amplify.configure(awsexports);
const FaceLivenessChecker = ({ afterLivenessChecker }) => {
    const [loading, setLoading] = useState(true);
    const [createLivenessApiData, setCreateLivenessApiData] = useState(null);
    const apiPath = '/api/aws-rekognition';
    const [attempt, setAttempt] = useState(0); // To force re-rendering

    const getCreds = () => {
        fetch(apiPath + '/getCreds')
            .then(response => response.json())
            .then(data => {
                fetchCreateLiveness();
            });
    };

    const fetchCreateLiveness = () => {
        fetch(apiPath + '/createLiveness')
            .then(response => response.json())
            .then(data => {
                setCreateLivenessApiData(data);
                setLoading(false);
            });
    };
    useEffect(() => {
        getCreds();
    }, []);
    const handleAnalysisComplete = async () => {
        const response = await fetch(apiPath + `/getsession?sessionId=${createLivenessApiData.sessionId}`);
        let data = await response.json();
        data = data.data;
        if (data.Status === "SUCCEEDED" && data.Confidence > 80) {
            afterLivenessChecker(data.ImageBase64);
        } 
    };

    const handleRetry = () => {
        setAttempt(prev => prev + 1); // Force re-render by updating key
    };

    return (
        <>
            <ThemeProvider>
                {loading ? (
                    <Loader />
                ) : (
                    <>
                        <FaceLivenessDetector
                            key={attempt}
                            sessionId={createLivenessApiData.sessionId}
                            region="eu-west-1"
                            onAnalysisComplete={handleAnalysisComplete}
                            onError={(error) => {
                                handleRetry();
                            }}
                        />

                    </>
                )}
            </ThemeProvider>
        </>
    );
}

export default FaceLivenessChecker;
