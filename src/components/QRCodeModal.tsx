import React, { useState } from 'react';
import { X, Printer, Copy, Check, Download } from 'lucide-react';
import { Restaurant } from '../types';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeModalProps {
  restaurant: Restaurant;
  isOpen: boolean;
  onClose: () => void;
}

export default function QRCodeModal({ restaurant, isOpen, onClose }: QRCodeModalProps) {
  const [copied, setCopied] = useState(false);
  const [selectedTable, setSelectedTable] = useState('عمومی');

  if (!isOpen) return null;

  // Generate QR relative path (using hash-based routing for 100% SPA reliability)
  const menuUrl = `${window.location.origin}/#/menu/${restaurant.slug}${selectedTable !== 'عمومی' ? `?table=${selectedTable}` : ''}`;

  const copyLink = () => {
    navigator.clipboard.writeText(menuUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const printCard = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs font-sans" dir="rtl">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-neutral-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-100 bg-neutral-50/50">
          <div>
            <h3 className="font-bold text-neutral-900 text-lg">ایجاد و چاپ QR Code منو</h3>
            <p className="text-xs text-neutral-500 mt-0.5">بارکد مخصوص روی میزها یا کانتر جهت اسکن توسط مشتریان</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-neutral-100 rounded-full text-neutral-400 hover:text-neutral-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto flex flex-col items-center">
          {/* Table Selector */}
          <div className="w-full mb-6">
            <label className="text-xs font-bold text-neutral-500 block mb-2">انتخاب میز جهت ایجاد بارکد اختصاصی:</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTable('عمومی')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedTable === 'عمومی' ? 'bg-amber-500 text-white shadow-xs' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}`}
              >
                بارکد عمومی منو
              </button>
              {Array.from({ length: restaurant.tablesCount }).map((_, idx) => {
                const tableNo = String(idx + 1);
                return (
                  <button
                    key={tableNo}
                    onClick={() => setSelectedTable(tableNo)}
                    className={`w-10 h-8 rounded-lg text-xs font-medium transition-all flex items-center justify-center ${selectedTable === tableNo ? 'bg-amber-500 text-white shadow-xs' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}`}
                  >
                    میز {tableNo}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Printable Card Preview */}
          <div id="printable-qr-card" className="border-2 border-neutral-200 rounded-2xl p-6 bg-amber-50/30 max-w-xs w-full flex flex-col items-center text-center shadow-xs">
            <span className="text-3xl mb-1">{restaurant.logo}</span>
            <h4 className="font-bold text-neutral-800 text-base">{restaurant.name}</h4>

            {selectedTable !== 'عمومی' && (
              <div className="mt-1 bg-amber-500 text-white text-[10px] font-bold px-3 py-0.5 rounded-full">
                میز شماره {selectedTable}
              </div>
            )}

            {/* Beautiful real scannable QR Code */}
            <div className="bg-white p-4 rounded-2xl border border-neutral-100 my-4 shadow-md flex items-center justify-center">
              <QRCodeSVG
                value={menuUrl}
                size={160}
                bgColor={"#ffffff"}
                fgColor={restaurant.accentColor || "#1e293b"}
                level={"H"}
                includeMargin={true}
              />
            </div>

            <p className="text-[10px] text-neutral-500 font-bold tracking-wider uppercase mb-1">SCAN ME TO ORDER</p>
            <p className="text-[11px] text-neutral-600 leading-relaxed max-w-[200px]">
              دوربین موبایل خود را روی بارکد بگیرید تا منوی دیجیتال ما را بدون نیاز به نصب هیچ برنامه‌ای مشاهده کنید.
            </p>
          </div>

          {/* Action buttons */}
          <div className="w-full grid grid-cols-2 gap-3 mt-6">
            <button
              onClick={printCard}
              className="py-2.5 px-4 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>چاپ کارت میز</span>
            </button>

            <button
              onClick={copyLink}
              className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${copied ? 'bg-green-600 text-white' : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'}`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>کپی شد!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>کپی لینک منو</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
