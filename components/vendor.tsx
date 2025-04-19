'use client';

import cx from 'classnames';
import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import type { Vendor as VendorType } from '@/lib/db/schema';

const SAMPLE_VENDORS: VendorType[] = [
  {
    id: 'a55cde21-f4a4-4f0e-b85c-b938cad3d36f',
    internalId: 12345,
    vendorName: 'Acme Supplies',
    factoryName: 'Acme Factory',
    productRange: 'Widgets, Gadgets',
    category: 'Electronics',
    vendorType: 'Distributor',
    ytdPurchase: '$120,000',
    purchasesLY: '$100,000',
    // openPOs: 7,
    terms: 'Net 30',
    certificates: 'ISO9001',
    contactName: 'John Doe',
    email: 'john.doe@acme.com',
    phone: '+1-555-1234',
    country: 'USA',
    city: 'San Francisco',
    certification: 'CE, RoHS',
    factories: 'San Jose, Portland',
    relevant3rdParties: 'InspectCo',
    createdAt: new Date('2025-04-13T18:50:18.000Z'),
  },
];

export function Vendor({ companies }: { companies?: VendorType[] | null }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    console.log('🛠 Vendor prop companies:', companies);
  }, [companies]);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const maxItems = isMobile ? 3 : 5;
  const sourceArray = Array.isArray(companies) ? companies : SAMPLE_VENDORS;
  const list = sourceArray.slice(0, maxItems);

  if (list.length === 0) {
    return (
      <div className="py-8 text-center text-slate-400">
        No vendors available.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {list.map((v) => {
        const name = v.vendorName ?? '—';
        return (
          <div
            key={v.id}
            className={cx(
              'flex items-start gap-4 rounded-2xl p-4 max-w-[600px]',
              'bg-slate-800 shadow-sm hover:shadow-md transition'
            )}
          >
            {/* Avatar placeholder */}
            <div
              className={cx(
                'h-12 w-12 rounded-full flex items-center justify-center text-xl',
                'bg-slate-700 text-slate-200 font-medium'
              )}
            >
              {name.charAt(0)}
            </div>

            {/* Main info + details */}
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h3 className="text-slate-50 text-xl font-semibold">{name}</h3>
                +       {v.createdAt && (
                <span className="text-slate-400 text-xs">
                    {formatDistanceToNow(v.createdAt, { addSuffix: true })}
                </span>
                )}
              </div>

              <p className="text-slate-300 text-sm mb-2">
                {v.city && v.country ? `${v.city}, ${v.country}` : v.country || v.city}
              </p>

              <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-slate-200">
                {v.internalId != null && (
                  <div><span className="font-medium">ID:</span> {v.internalId}</div>
                )}
                {v.factoryName && (
                  <div><span className="font-medium">Factory:</span> {v.factoryName}</div>
                )}
                {v.productRange && (
                  <div><span className="font-medium">Products:</span> {v.productRange}</div>
                )}
                {v.category && (
                  <div><span className="font-medium">Category:</span> {v.category}</div>
                )}
                {v.vendorType && (
                  <div><span className="font-medium">Type:</span> {v.vendorType}</div>
                )}
                {v.ytdPurchase && (
                  <div><span className="font-medium">YTD Purchases:</span> {v.ytdPurchase}</div>
                )}
                {v.purchasesLY && (
                  <div><span className="font-medium">Last Year:</span> {v.purchasesLY}</div>
                )}
                {/* {v.openPOs != null && (
                  <div><span className="font-medium">Open POs:</span> {v.openPOs}</div>
                )} */}
                {v.terms && (
                  <div><span className="font-medium">Terms:</span> {v.terms}</div>
                )}
                {v.certificates && (
                  <div><span className="font-medium">Certificates:</span> {v.certificates}</div>
                )}
                {v.contactName && (
                  <div><span className="font-medium">Contact:</span> {v.contactName}</div>
                )}
                {v.email && (
                  <div><span className="font-medium">Email:</span> {v.email}</div>
                )}
                {v.phone && (
                  <div><span className="font-medium">Phone:</span> {v.phone}</div>
                )}
                {v.factories && (
                  <div><span className="font-medium">Factories:</span> {v.factories}</div>
                )}
                {v.relevant3rdParties && (
                  <div><span className="font-medium">3rd Parties:</span> {v.relevant3rdParties}</div>
                )}
                {v.certification && (
                  <div><span className="font-medium">Cert Docs:</span> {v.certification}</div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
