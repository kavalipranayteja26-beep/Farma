import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Wallet, Plus, ArrowDownLeft, ArrowUpRight, ShieldCheck, Heart } from 'lucide-react';

const WalletModal = () => {
  const { isWalletModalOpen, setIsWalletModalOpen, user, walletTransactions, addWalletMoney } = useApp();
  const [topUpAmount, setTopUpAmount] = useState('500');

  if (!isWalletModalOpen || !user) return null;

  const handleTopUpSubmit = (e) => {
    e.preventDefault();
    addWalletMoney(topUpAmount);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-amber-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-slate-950" />
            <h2 className="font-extrabold text-lg font-outfit text-slate-950">FarmaWallet & Rewards</h2>
          </div>
          <button 
            onClick={() => setIsWalletModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-amber-700 text-amber-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          
          {/* Balance Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-slate-950 shadow-lg space-y-2">
            <div className="flex justify-between text-xs font-black uppercase tracking-wider text-slate-950/80">
              <span>Available Wallet Credit</span>
              <span>1-Click Checkout</span>
            </div>
            <div className="text-4xl font-extrabold font-outfit text-slate-950">₹{user.walletBalance}</div>
            <div className="text-xs text-slate-900 font-semibold flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 fill-current text-slate-950" />
              <span>Organic Health Points: {user.healthPoints || 120} Points</span>
            </div>
          </div>

          {/* Quick Top Up */}
          <form onSubmit={handleTopUpSubmit} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="text-xs font-bold text-slate-800">Add Money to Wallet</div>
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                placeholder="Enter amount"
                required
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-sm"
              >
                + Top-Up
              </button>
            </div>
            <div className="flex gap-2">
              {[100, 250, 500, 1000].map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setTopUpAmount(amt.toString())}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-slate-700 hover:border-amber-400"
                >
                  +₹{amt}
                </button>
              ))}
            </div>
          </form>

          {/* Transaction History */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-800">Recent Wallet Transactions</div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {walletTransactions.map(tx => (
                <div key={tx.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${tx.type === 'credit' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                      {tx.type === 'credit' ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">{tx.desc}</div>
                      <div className="text-[10px] text-slate-400">{tx.date}</div>
                    </div>
                  </div>
                  <span className={`font-extrabold ${tx.type === 'credit' ? 'text-emerald-700' : 'text-slate-900'}`}>
                    {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default WalletModal;
