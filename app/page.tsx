"use client";

import React, { useState, useEffect } from "react";

type Screen = "dashboard" | "scanner" | "verification" | "confirmation" | "tracker";

interface Check {
  id: string;
  amount: number;
  bank: string;
  days: number;
  issuer: string;
  number: string;
  account: string;
}

const DEMO_CHECKS: Check[] = [
  { id: 'A', amount: 30000, bank: 'BPI', days: 7, issuer: 'Mang Juan Grill', number: '1029384756', account: '0011-2233-44' },
  { id: 'B', amount: 50000, bank: 'UnionBank', days: 30, issuer: 'Golden Fork Resto', number: '5647382910', account: '9988-7766-55' },
  { id: 'C', amount: 100000, bank: 'BDO', days: 60, issuer: 'Metro Bakery Chain', number: '2039485761', account: '5544-3322-11' },
];

export default function SnapCheque() {
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [balance, setBalance] = useState<number>(14250.00);
  const [selectedCheck, setSelectedCheck] = useState<Check | null>(null);
  
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(val);

  return (
    <div className="device-frame">
      <div className="app-container" style={{ padding: '0', display: 'flex', flexDirection: 'column' }}>
        {screen === "dashboard" && (
          <Dashboard 
            balance={balance} 
            format={formatCurrency} 
            onScan={() => setScreen("scanner")} 
          />
        )}
        
        {screen === "scanner" && (
          <Scanner 
            onSelect={(check: Check) => { 
              setSelectedCheck(check); 
              setScreen("verification"); 
            }} 
            onCancel={() => setScreen("dashboard")} 
          />
        )}
        
        {screen === "verification" && selectedCheck && (
          <Verification 
            check={selectedCheck} 
            format={formatCurrency} 
            onConfirm={(cashout: number) => { 
              setBalance(prev => prev + cashout); 
              setScreen("confirmation"); 
            }} 
            onCancel={() => setScreen("scanner")} 
          />
        )}
        
        {screen === "confirmation" && selectedCheck && (
          <Confirmation 
            check={selectedCheck} 
            format={formatCurrency} 
            onNext={() => setScreen("tracker")} 
            onHome={() => setScreen("dashboard")} 
          />
        )}
        
        {screen === "tracker" && selectedCheck && (
          <Tracker 
            check={selectedCheck} 
            format={formatCurrency} 
            onHome={() => setScreen("dashboard")} 
          />
        )}
      </div>
    </div>
  );
}

// --- SCREEN 1: Dashboard ---
function Dashboard({ balance, format, onScan }: any) {
  return (
    <div className="flex-col w-full animate-slide-up overflow-y-auto" style={{ position: 'absolute', inset: 0, animationDuration: '0.2s' }}>
      <div className="dashboard-header">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '2px solid rgba(255,255,255,0.2)' }}>
              <img src="/gcash-logo.jpg" alt="GCash Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <div className="font-bold text-md" style={{ color: 'white'}}>Aling Nena's LPG</div>
              <div className="text-xs" style={{ color: 'white', opacity: 0.8}}>GCash Negosyo Profile</div>
            </div>
          </div>
        </div>
        <div style={{ background: 'rgba(255, 255, 255, 0.15)', padding: '16px 20px', borderRadius: '16px', marginTop: '12px', border: '1px solid rgba(255, 255, 255, 0.2)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <p className="text-sm" style={{ color: 'white', opacity: 0.9}}>Available Balance</p>
          <h1 className="text-4xl mt-1" style={{ color: 'white', letterSpacing: '-0.5px'}}>{format(balance)}</h1>
        </div>
      </div>
      
      <div className="px-6 pb-8 flex-1" style={{ marginTop: '-24px', position: 'relative', zIndex: 10 }}>
        <div className="card mb-8 flex-col gap-4" style={{ padding: '24px', background: 'white' }}>
          <div className="flex items-start gap-4">
            <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: '#F0F9FF', color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
            </div>
            <div>
              <h3 style={{ color: 'var(--text-main)', marginBottom: '4px', fontSize: '18px' }}>SnapCheque</h3>
              <p className="text-sm text-muted" style={{ lineHeight: '1.5' }}>
                Turn your post-dated checks into instant cash today with Fuse Lending.
              </p>
            </div>
          </div>
          
          <button className="btn btn-primary mt-2" onClick={onScan} style={{ boxShadow: '0 8px 16px rgba(0, 92, 238, 0.25)' }}>
            <span style={{ color: 'white', fontWeight: 'bold' }}>Scan Post-Dated Check</span>
          </button>
        </div>
        
        <div className="flex justify-between items-center mb-4 px-1">
          <h4 style={{ color: 'var(--text-main)', fontSize: '18px' }}>Recent Advances</h4>
          <span className="text-xs font-bold text-primary cursor-pointer">View All</span>
        </div>
        
        <div className="card flex-col gap-3" style={{ padding: '20px', background: 'white', border: '1px solid var(--border-color)', boxShadow: 'none' }}>
          <div className="flex justify-between items-center">
            <span className="font-bold text-xl" style={{ color: 'var(--text-main)'}}>{format(25000)}</span>
            <span className="text-xs font-bold" style={{ background: '#F0FDF4', color: '#16A34A', padding: '6px 12px', borderRadius: '8px', border: '1px solid #BBF7D0'}}>
              Advanced
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted">Clears in 12 days</span>
            <span className="text-sm font-bold text-muted">BDO</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SCREEN 2: Scanner ---
function Scanner({ onSelect, onCancel }: any) {
  const [isScanning, setIsScanning] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const timeoutRef = React.useRef<any>(null);
  
  useEffect(() => {
    let stream: MediaStream | null = null;
    async function startCamera() {
      try {
        // Force back camera on mobile devices
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: { exact: 'environment' } } 
        });
      } catch (err) {
        // Fallback for laptops or devices without a specific "environment" camera
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        } catch (errFallback) {
          console.error("Camera access error:", errFallback);
        }
      }
      
      if (stream && videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    }
    startCamera();
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);
  
  const handleSelect = (check: any) => {
    setIsScanning(true);
    timeoutRef.current = setTimeout(() => {
      onSelect(check);
    }, 1500);
  };

  const handleCapture = () => {
    setIsScanning(true);
    timeoutRef.current = setTimeout(() => {
      const randomCheck = DEMO_CHECKS[Math.floor(Math.random() * DEMO_CHECKS.length)];
      onSelect(randomCheck);
    }, 2000);
  };
  
  const handleCancel = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    onCancel();
  };

  return (
    <div className="flex-col w-full animate-slide-up" style={{ position: 'absolute', inset: 0, backgroundColor: '#111', overflow: 'hidden' }}>
      <video 
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
        }}
      />

      <div className="p-4 flex justify-between items-center" style={{ position: 'absolute', top: 0, width: '100%', zIndex: 50 }}>
        <button onClick={handleCancel} style={{ background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', padding: '10px 16px', borderRadius: '20px', fontSize: '14px', cursor: 'pointer', fontWeight: 'bold' }}>
          Cancel
        </button>
        <span style={{ color: 'white', fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Scan Check</span>
        <div style={{ width: '80px' }}></div>
      </div>

      <div className="flex-1 flex justify-center items-center relative p-4 mt-12" style={{ zIndex: 10 }}>
        <div style={{ width: '100%', height: '260px', border: '2px solid rgba(255,255,255,0.6)', borderRadius: '16px', position: 'relative', overflow: 'hidden', boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)' }}>
          <div style={{ position: 'absolute', top: '-2px', left: '-2px', width: '30px', height: '30px', borderTop: '4px solid var(--accent-green)', borderLeft: '4px solid var(--accent-green)', borderTopLeftRadius: '16px' }}></div>
          <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '30px', height: '30px', borderTop: '4px solid var(--accent-green)', borderRight: '4px solid var(--accent-green)', borderTopRightRadius: '16px' }}></div>
          <div style={{ position: 'absolute', bottom: '-2px', left: '-2px', width: '30px', height: '30px', borderBottom: '4px solid var(--accent-green)', borderLeft: '4px solid var(--accent-green)', borderBottomLeftRadius: '16px' }}></div>
          <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '30px', height: '30px', borderBottom: '4px solid var(--accent-green)', borderRight: '4px solid var(--accent-green)', borderBottomRightRadius: '16px' }}></div>
          
          {isScanning && <div className="scan-line"></div>}
          
          <div className="absolute w-full text-center" style={{ top: '50%', transform: 'translateY(-50%)' }}>
            <span style={{ color: 'white', backgroundColor: 'rgba(0,0,0,0.7)', padding: '12px 24px', borderRadius: '24px', fontSize: '14px', fontWeight: 'bold', transition: 'opacity 0.3s', opacity: isScanning ? 1 : 0.8 }}>
              {isScanning ? 'Extracting details...' : 'Align check within frame'}
            </span>
          </div>
        </div>
      </div>

      {/* Capture Button (Hidden when drawer is open) */}
      <div className="absolute w-full flex justify-center" style={{ bottom: '90px', transition: 'all 0.3s ease', opacity: isDrawerOpen ? 0 : 1, pointerEvents: isDrawerOpen ? 'none' : 'auto', transform: isDrawerOpen ? 'translateY(20px)' : 'translateY(0)', zIndex: 15 }}>
         <button 
           onClick={handleCapture}
           style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(255,255,255,0.3)', border: '4px solid white', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', padding: 0 }}
         >
           <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'white', transition: 'transform 0.1s' }} onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.9)'} onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}></div>
         </button>
      </div>
      
      <div className="absolute w-full" style={{ 
        bottom: 0, 
        background: 'var(--background)', 
        borderTopLeftRadius: '32px', 
        borderTopRightRadius: '32px', 
        padding: '16px 24px 32px 24px', 
        zIndex: 20, 
        boxShadow: '0 -8px 24px rgba(0,0,0,0.1)',
        transform: isDrawerOpen ? 'translateY(0)' : 'translateY(calc(100% - 76px))',
        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <div 
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          style={{ display: 'flex', justifyContent: 'center', paddingBottom: '16px', cursor: 'pointer' }}
        >
          <div style={{ width: '40px', height: '5px', borderRadius: '3px', background: '#CBD5E1' }}></div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h3 style={{ color: 'var(--text-main)', margin: 0 }}>Simulate Demo Check</h3>
          <button onClick={() => setIsDrawerOpen(!isDrawerOpen)} style={{ background: 'none', border: 'none', color: 'var(--primary-blue)', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>
            {isDrawerOpen ? 'Hide' : 'Show'}
          </button>
        </div>

        <div style={{ opacity: isDrawerOpen ? 1 : 0, transition: 'opacity 0.3s', pointerEvents: isDrawerOpen ? 'auto' : 'none' }}>
          <p className="text-xs text-muted mb-4">Point the camera at your printed check, then select the matching demo below to simulate extraction.</p>
          <div className="flex-col gap-3">
            {DEMO_CHECKS.map(c => (
              <div key={c.id} className="card" style={{ padding: '16px 20px', cursor: 'pointer', border: '1px solid var(--border-color)', boxShadow: 'none', background: 'white' }} onClick={() => handleSelect(c)}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-xl" style={{ color: 'var(--text-main)'}}>₱{c.amount.toLocaleString()}</span>
                  <span className="text-xs font-bold" style={{ background: '#f1f5f9', padding: '6px 10px', borderRadius: '8px', color: 'var(--text-main)' }}>Due in {c.days} Days</span>
                </div>
                <div className="text-sm text-muted">{c.bank} • {c.issuer}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SCREEN 3: Verification ---
function Verification({ check, format, onConfirm, onCancel }: any) {
  const getFeePercentage = (days: number) => {
    if (days <= 7) return 1.2;
    if (days <= 15) return 2.0;
    if (days <= 30) return 3.5;
    return 5.0;
  };

  const percentage = getFeePercentage(check.days);
  const feeAmount = check.amount * (percentage / 100);
  const netAmount = check.amount - feeAmount;

  return (
    <div className="flex-col animate-slide-up" style={{ position: 'absolute', inset: 0, backgroundColor: 'var(--background)' }}>
      <div className="flex items-center bg-white border-b" style={{ padding: '16px', zIndex: 10 }}>
        <button onClick={onCancel} style={{ background: 'none', border: 'none', fontSize: '20px', marginRight: '16px', color: 'var(--text-main)', cursor: 'pointer' }}>←</button>
        <span className="font-bold text-lg" style={{ color: 'var(--text-main)' }}>Review Advance</span>
      </div>

      <div className="flex-1 flex-col gap-3" style={{ padding: '16px 16px 8px 16px' }}>
        <div className="card" style={{ padding: '14px 16px', background: '#F0FDF4', border: '1px solid #BBF7D0', boxShadow: 'none' }}>
          <h4 className="text-xs font-bold text-success mb-2">Fuse Lending Verification</h4>
          <div className="flex-col gap-1" style={{ fontSize: '12px', color: '#166534' }}>
            <div className="flex items-center gap-2"><span>✔</span> Buyer Account Verified</div>
            <div className="flex items-center gap-2"><span>✔</span> Issuer GScore: 745 (Low Risk)</div>
            <div className="flex items-center gap-2"><span>✔</span> Clearing Partner Route: PCHC Approved</div>
          </div>
        </div>

        <div className="card" style={{ padding: '14px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h4 className="text-xs font-bold mb-2 border-b pb-2">Check Details</h4>
          <div className="flex justify-between mb-1.5">
            <span className="text-xs text-muted">Issuer</span>
            <span className="text-xs font-medium">{check.issuer}</span>
          </div>
          <div className="flex justify-between mb-1.5">
            <span className="text-xs text-muted">Bank</span>
            <span className="text-xs font-medium">{check.bank}</span>
          </div>
          <div className="flex justify-between mb-1.5">
            <span className="text-xs text-muted">Check No.</span>
            <span className="text-xs font-medium">{check.number}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-muted">Maturity</span>
            <span className="text-xs font-medium">{check.days} Days</span>
          </div>
        </div>

        <div className="card" style={{ padding: '14px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h4 className="text-xs font-bold mb-2 border-b pb-2">Discounting Engine</h4>
          <div className="flex justify-between mb-1.5">
            <span className="text-xs text-muted">Face Value</span>
            <span className="text-xs font-medium">{format(check.amount)}</span>
          </div>
          <div className="flex justify-between mb-2.5">
            <span className="text-xs text-muted">Financing Fee ({percentage}%)</span>
            <span className="text-xs font-medium" style={{ color: '#ef4444' }}>- {format(feeAmount)}</span>
          </div>
          <div className="border-t pt-2.5 flex justify-between items-center">
            <span className="text-xs font-bold">Net Instant Cashout</span>
            <span className="text-lg font-bold text-success">{format(netAmount)}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white border-t" style={{ padding: '16px 16px 32px 16px', zIndex: 50, flexShrink: 0 }}>
        <button className="btn btn-primary w-full" onClick={() => onConfirm(netAmount)}>
          <span style={{ color: 'white', fontWeight: 'bold' }}>Confirm & Advance {format(netAmount)}</span>
        </button>
      </div>
    </div>
  );
}

// --- SCREEN 4: Confirmation ---
function Confirmation({ check, format, onNext, onHome }: any) {
  const getFeePercentage = (days: number) => {
    if (days <= 7) return 1.2;
    if (days <= 15) return 2.0;
    if (days <= 30) return 3.5;
    return 5.0;
  };
  const percentage = getFeePercentage(check.days);
  const feeAmount = check.amount * (percentage / 100);
  const netAmount = check.amount - feeAmount;

  return (
    <div className="flex-col animate-slide-up text-center" style={{ position: 'absolute', inset: 0, backgroundColor: 'white', justifyContent: 'center', padding: '16px' }}>
      <div className="mb-6 flex justify-center">
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#E6F8F3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '40px', color: '#00C48C' }}>✓</span>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-2">Advance Successful</h2>
      <p className="text-sm text-muted mb-6">
        <span className="font-bold text-success" style={{ fontSize: '18px' }}>{format(netAmount)}</span> credited to your GCash Wallet.
      </p>

      <div className="card text-left mb-8 w-full" style={{ background: 'var(--background)', boxShadow: 'none' }}>
        <div className="flex justify-between mb-2">
          <span className="text-xs text-muted">Ref. Number</span>
          <span className="text-xs font-bold">SC-{Math.floor(100000 + Math.random() * 900000)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-xs text-muted">PDC Holding ID</span>
          <span className="text-xs font-bold">PDC-{check.number}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-xs text-muted">Auto-Settlement Date</span>
          <span className="text-xs font-bold">In {check.days} Days</span>
        </div>
      </div>

      <div className="flex-col gap-3 w-full absolute" style={{ bottom: '24px', left: 0, padding: '0 16px' }}>
        <button className="btn btn-primary" onClick={onNext}>
          <span style={{ color: 'white' }}>View Active Check Tracker</span>
        </button>
        <button className="btn btn-outline" onClick={onHome}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

// --- SCREEN 5: Tracker ---
function Tracker({ check, format, onHome }: any) {
  return (
    <div className="flex-col animate-slide-up" style={{ position: 'absolute', inset: 0, backgroundColor: 'var(--background)' }}>
      <div className="flex items-center bg-white border-b" style={{ padding: '16px', zIndex: 10 }}>
        <button onClick={onHome} style={{ background: 'none', border: 'none', fontSize: '20px', marginRight: '16px', color: 'var(--text-main)', cursor: 'pointer' }}>←</button>
        <span className="font-bold text-lg" style={{ color: 'var(--text-main)' }}>Active Tracker</span>
      </div>

      <div className="flex-1 overflow-y-auto" style={{ padding: '16px', minHeight: 0 }}>
        <div className="card mb-4" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="font-bold">{check.issuer}</h4>
              <p className="text-xs text-muted">Check No. {check.number}</p>
            </div>
            <div className="text-right">
              <span className="font-bold text-lg">{format(check.amount)}</span>
            </div>
          </div>

          <div className="relative pt-2 pb-2">
            <div style={{ position: 'absolute', left: '11px', top: '16px', bottom: '16px', width: '2px', background: '#E5E7EB', zIndex: 0 }}></div>
            
            <div className="flex gap-4 items-start mb-6 relative z-10">
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--accent-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                <span style={{ color: 'white', fontSize: '12px' }}>✓</span>
              </div>
              <div>
                <h5 className="text-sm font-bold text-success">Advanced (Funds Released)</h5>
                <p className="text-xs text-muted mt-1">Today • Instant Cashout</p>
              </div>
            </div>

            <div className="flex gap-4 items-start mb-6 relative z-10">
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'white', border: '2px solid var(--primary-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary-blue)' }}></div>
              </div>
              <div>
                <h5 className="text-sm font-bold text-primary">Awaiting Clearing</h5>
                <p className="text-xs text-muted mt-1">Day 1 of {check.days}</p>
              </div>
            </div>

            <div className="flex gap-4 items-start relative z-10">
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'white', border: '2px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
              </div>
              <div>
                <h5 className="text-sm font-bold text-muted" style={{ opacity: 0.5 }}>Settled</h5>
                <p className="text-xs text-muted mt-1" style={{ opacity: 0.5 }}>In {check.days} days</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div className="flex items-center gap-2 mb-2">
            <span style={{ fontSize: '18px' }}>🛡️</span>
            <h4 className="text-sm font-bold">Fuse Safety Net</h4>
          </div>
          <p className="text-xs text-muted mb-2">
            Your business is protected. Fuse Lending guarantees payment and handles the risk of check bounces via linked auto-debit agreements with the issuer.
          </p>
          <span className="text-xs text-primary font-bold cursor-pointer">Learn More</span>
        </div>
      </div>
    </div>
  );
}
