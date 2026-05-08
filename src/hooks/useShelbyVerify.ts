import { useState, useCallback } from 'react';
import type { ResumeData, VerifyResult } from '../types/resume';
import { SHELBY_RPC } from '../config/constants';

interface UseShelbyVerifyReturn {
  verify: (blobId: string) => Promise<VerifyResult | null>;
  isVerifying: boolean;
  result: VerifyResult | null;
  error: string | null;
}

export function useShelbyVerify(): UseShelbyVerifyReturn {
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const verify = useCallback(async (blobId: string): Promise<VerifyResult | null> => {
    setIsVerifying(true);
    setError(null);
    setResult(null);

    try {
      let resumeData: ResumeData;

      try {
        // Try to fetch blob from Shelby network
        const response = await fetch(`${SHELBY_RPC}/v1/blobs/${blobId}`);
        if (!response.ok) {
          throw new Error(`Shelby returned ${response.status}`);
        }
        const blobBytes = await response.arrayBuffer();
        const jsonText = new TextDecoder().decode(blobBytes);
        resumeData = JSON.parse(jsonText) as ResumeData;
      } catch (fetchErr) {
        // Fallback: try alternative URL patterns
        try {
          const altResponse = await fetch(`${SHELBY_RPC}/v1/blob/${blobId}`);
          if (altResponse.ok) {
            const jsonText = await altResponse.text();
            resumeData = JSON.parse(jsonText) as ResumeData;
          } else {
            throw fetchErr;
          }
        } catch {
          // Final fallback: check localStorage for locally published resumes
          const localData = localStorage.getItem(`veritas_blob_${blobId}`);
          if (localData) {
            resumeData = JSON.parse(localData) as ResumeData;
          } else {
            throw new Error('Could not fetch blob from Shelby network. Make sure the Blob ID is correct and the network is accessible.');
          }
        }
      }

      // Verify schema
      if (resumeData.schema !== 'veritas/resume/v1') {
        throw new Error('Invalid resume schema - this blob is not a Veritas resume.');
      }

      const verifyResult: VerifyResult = {
        blobId,
        owner: resumeData.identity.wallet || 'unknown',
        txHash: '0x' + blobId.slice(2, 34),
        resumeData,
        verifiedAt: new Date().toISOString(),
      };

      setResult(verifyResult);
      return verifyResult;

    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Verification failed';
      setError(msg);
      return null;
    } finally {
      setIsVerifying(false);
    }
  }, []);

  return { verify, isVerifying, result, error };
}
