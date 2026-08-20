"use client";

import React, { useState } from "react";

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
    <div className="flex-col w-full h-full animate-slide-up" style={{ animationDuration: '0.2s' }}>
      <div className="dashboard-header">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div style={{ width: '32px', height: '32px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'var(--primary-blue)', fontWeight: 'bold', fontSize: '12px'}}>GC</span>
            </div>
            <div>
              <div className="font-bold text-sm" style={{ color: 'white'}}>Aling Nena's LPG</div>
              <div className="text-xs" style={{ color: 'white', opacity: 0.8}}>GCash Negosyo Profile</div>
            </div>
          </div>
        </div>
        <p className="text-sm" style={{ color: 'white', opacity: 0.8}}>Available Balance</p>
        <h1 className="text-3xl mt-1" style={{ color: 'white'}}>{format(balance)}</h1>
      </div>
      
      <div className="px-4 pb-6 flex-1">
        <div className="card hero-card shadow-lg">
          <h3 className="mb-2" style={{ color: 'white'}}>SnapCheque</h3>
          <p className="text-sm" style={{ color: 'white', opacity: 0.9}}>
            Turn post-dated checks into instant cash today with Fuse Lending.
          </p>
        </div>
        
        <div className="mt-6 mb-6">
          <button className="btn btn-primary" onClick={onScan}>
            <span style={{ color: 'white'}}>Scan Post-Dated Check</span>
          </button>
        </div>
        
        <div className="flex justify-between items-center mb-3">
          <h4 style={{ color: 'var(--text-main)'}}>Recent Advances</h4>
          <span className="text-xs text-primary font-medium cursor-pointer">View All</span>
        </div>
        
        <div className="card flex-col gap-2 border-b" style={{ border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'}}>
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg">{format(25000)}</span>
            <span className="text-xs font-bold" style={{ background: '#E6F8F3', color: '#00C48C', padding: '4px 8px', borderRadius: '4px'}}>
              Advanced
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted">Clears in 12 days</span>
            <span className="text-xs text-muted">BDO</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SCREEN 2: Scanner ---
function Scanner({ onSelect, onCancel }: any) {
  const [isScanning, setIsScanning] = useState(false);
  
  const handleSelect = (check: any) => {
    setIsScanning(true);
    setTimeout(() => {
      onSelect(check);
    }, 1500);
  };

  return (
    <div className="flex-col w-full h-full relative animate-slide-up" style={{ backgroundColor: '#111' }}>
      <div className="p-4 flex justify-between items-center" style={{ position: 'absolute', top: 0, width: '100%', zIndex: 10 }}>
        <button onClick={onCancel} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '8px 12px', borderRadius: '20px', fontSize: '14px', cursor: 'pointer' }}>
          Cancel
        </button>
        <span style={{ color: 'white', fontWeight: 'bold' }}>Scan Check</span>
        <div style={{ width: '60px' }}></div>
      </div>

      <div className="flex-1 flex justify-center items-center relative p-4 mt-12">
        <div style={{ width: '100%', height: '220px', border: '2px solid rgba(255,255,255,0.4)', borderRadius: '12px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-2px', left: '-2px', width: '20px', height: '20px', borderTop: '4px solid var(--accent-green)', borderLeft: '4px solid var(--accent-green)', borderTopLeftRadius: '12px' }}></div>
          <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '20px', height: '20px', borderTop: '4px solid var(--accent-green)', borderRight: '4px solid var(--accent-green)', borderTopRightRadius: '12px' }}></div>
          <div style={{ position: 'absolute', bottom: '-2px', left: '-2px', width: '20px', height: '20px', borderBottom: '4px solid var(--accent-green)', borderLeft: '4px solid var(--accent-green)', borderBottomLeftRadius: '12px' }}></div>
          <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '20px', height: '20px', borderBottom: '4px solid var(--accent-green)', borderRight: '4px solid var(--accent-green)', borderBottomRightRadius: '12px' }}></div>
          
          {isScanning && <div className="scan-line"></div>}
          
          <div className="absolute w-full text-center" style={{ top: '50%', transform: 'translateY(-50%)' }}>
            <span style={{ color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', padding: '8px 16px', borderRadius: '20px', fontSize: '14px' }}>
              {isScanning ? 'Extracting details...' : 'Align check within frame'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="absolute w-full" style={{ bottom: 0, background: 'var(--background)', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', padding: '24px 16px', zIndex: 20 }}>
        <h3 className="mb-4" style={{ color: 'var(--text-main)' }}>Select Demo Check</h3>
        <div className="flex-col gap-3">
          {DEMO_CHECKS.map(c => (
            <div key={c.id} className="card" style={{ padding: '16px', cursor: 'pointer', border: '1px solid var(--border-color)', boxShadow: 'none' }} onClick={() => handleSelect(c)}>
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-lg" style={{ color: 'var(--text-main)'}}>₱{c.amount.toLocaleString()}</span>
                <span className="text-xs font-medium" style={{ background: '#f3f4f6', padding: '4px 8px', borderRadius: '4px', color: 'var(--text-main)' }}>Due in {c.days} Days</span>
              </div>
              <div className="text-xs text-muted">{c.bank} • {c.issuer}</div>
            </div>
          ))}
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
    <div className="flex-col w-full h-full animate-slide-up" style={{ backgroundColor: 'var(--background)' }}>
      <div className="p-4 flex items-center bg-white border-b sticky top-0" style={{ zIndex: 10 }}>
        <button onClick={onCancel} style={{ background: 'none', border: 'none', fontSize: '20px', marginRight: '16px', color: 'var(--text-main)', cursor: 'pointer' }}>←</button>
        <span className="font-bold text-lg" style={{ color: 'var(--text-main)' }}>Review Advance</span>
      </div>

      <div className="p-4 flex-1 overflow-y-auto" style={{ paddingBottom: '100px' }}>
        <div className="card mb-4" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', boxShadow: 'none' }}>
          <h4 className="text-sm font-bold text-success mb-2">Fuse Lending Verification</h4>
          <div className="flex-col gap-1 text-xs" style={{ color: '#166534' }}>
            <div className="flex items-center gap-2"><span>✔</span> Buyer Account Verified</div>
            <div className="flex items-center gap-2"><span>✔</span> Issuer GScore: 745 (Low Risk)</div>
            <div className="flex items-center gap-2"><span>✔</span> Clearing Partner Route: PCHC Approved</div>
          </div>
        </div>

        <div className="card mb-4" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h4 className="text-sm font-bold mb-3 border-b pb-2">Check Details</h4>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-muted">Issuer</span>
            <span className="text-sm font-medium">{check.issuer}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-muted">Bank</span>
            <span className="text-sm font-medium">{check.bank}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-muted">Check No.</span>
            <span className="text-sm font-medium">{check.number}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted">Maturity</span>
            <span className="text-sm font-medium">{check.days} Days</span>
          </div>
        </div>

        <div className="card mb-6" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h4 className="text-sm font-bold mb-3 border-b pb-2">Discounting Engine</h4>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-muted">Face Value</span>
            <span className="text-sm font-medium">{format(check.amount)}</span>
          </div>
          <div className="flex justify-between mb-3">
            <span className="text-sm text-muted">Financing Fee ({percentage}%)</span>
            <span className="text-sm font-medium" style={{ color: '#ef4444' }}>- {format(feeAmount)}</span>
          </div>
          <div className="border-t pt-3 flex justify-between items-center">
            <span className="text-sm font-bold">Net Instant Cashout</span>
            <span className="text-2xl font-bold text-success">{format(netAmount)}</span>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-white border-t absolute w-full" style={{ bottom: 0, zIndex: 10 }}>
        <button className="btn btn-primary" onClick={() => onConfirm(netAmount)}>
          <span style={{ color: 'white' }}>Confirm & Advance {format(netAmount)}</span>
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
    <div className="flex-col w-full h-full justify-center p-4 bg-white animate-slide-up text-center relative">
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
    <div className="flex-col w-full h-full animate-slide-up" style={{ backgroundColor: 'var(--background)' }}>
      <div className="p-4 flex items-center bg-white border-b sticky top-0" style={{ zIndex: 10 }}>
        <button onClick={onHome} style={{ background: 'none', border: 'none', fontSize: '20px', marginRight: '16px', color: 'var(--text-main)', cursor: 'pointer' }}>←</button>
        <span className="font-bold text-lg" style={{ color: 'var(--text-main)' }}>Active Tracker</span>
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
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
