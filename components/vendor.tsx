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
    ytdPurchases: '$120,000',
    purchasesLy: '$100,000',
    openPOs: 7,
    terms: 'Net 30',
    certificates: 'ISO9001',
    name: 'John Doe',
    email: 'john.doe@acme.com',
    phone: '+1-555-1234',
    country: 'USA',
    city: 'San Francisco',
    certificationDocuments: 'CE, RoHS',
    factories: 'San Jose, Portland',
    relevant3RdPartySocialAudit: 'InspectCo',
    audits:       'Audits',
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
        const auditItems = v.audits ? v.audits.split(',') : [];
        const socialAuditItems = v.relevant3RdPartySocialAudit ? v.relevant3RdPartySocialAudit.split(',') : [];
        const uniqueAudits = [...new Set([...auditItems, ...socialAuditItems])];

        const name = v.vendorName ?? '—';
        return (
          <div
            key={v.id}
            className={cx(
              'flex items-start gap-4 rounded-[28px] px-6 py-[20px] max-w-[1000px]',
              'bg-white shadow-[0_1px_2px_rgba(0,0,0,0.2)] hover:shadow-[0_4px_3px_rgba(0,0,0,0.3)] transition border border-black/3'
            )}
          >

            <div className="flex-1 flex gap-7">
              <div className="left flex-1 flex flex-col gap-3 max-w-72">
                
                <div className="title mb-2">
                  {v.vendorName ? (
                    <h3 className="text-textColor-primary text-xl font-semibold">{name}</h3>
                  ) : (
                    <h3 className="text-textColor-tertiary text-xl font-semibold italic">Unknown Vendor Name</h3>
                  )}

                  {v.factoryName ? (
                    <h4 className="text-textColor-secondary text-lg lowercase">{v.factoryName}</h4>
                  ) : (
                    <h4 className="text-textColor-quaternary italic text-lg">{'Unknown Factory Name'}</h4>
                  )}
                </div>

                <div className="section flex flex-col gap-1">
                  <p className="text-xs text-textColor-tertiary">Vendor Details</p>
                  
                  <div className="emoji-item flex gap-2 items-center">
                    <p className='w-4 text-sm'>📍</p>
                    {(v.country || v.city) ? (
                      <p>{v.city && v.country ? `${v.city}, ${v.country}` : v.country || v.city}</p>
                    ) : (
                      <p className="italic text-textColor-quaternary">None</p>
                    )}
                  </div>

                  <div className="emoji-item flex gap-2">
                    <p className='w-4 text-sm'>💼</p>
                    {v.name ? (
                      <p>{v.name}</p>
                    ) : (
                      <p className="italic text-textColor-quaternary">None</p>
                    )}
                  </div>

                  <div className="emoji-item flex gap-2 items-center">
                    <p className='w-4 text-sm'>✉️</p>
                    {v.email ? (
                      <p>{v.email}</p>
                    ) : (
                      <p className="italic text-textColor-quaternary">None</p>
                    )}
                  </div>
                  
                  <div className="emoji-item flex gap-2 items-center">
                    <p className='w-4 text-sm'>📞</p>
                    {(v.phone && v.phone !== v.email) ? (
                      <p>{v.phone}</p>
                    ) : (
                      <p className="italic text-textColor-quaternary">None</p>
                    )}
                  </div>
                </div>
                
                <div className="section flex flex-col gap-1">
                  <p className="text-xs text-textColor-tertiary">Certifications Held</p>
                  <div className="emoji-item flex gap-2 items-center">
                    <p className='w-4 text-sm'>🏅</p>
                    {v.certificates ? (
                      <p>{v.certificates}</p>
                    ) : (
                      <p className="italic text-textColor-quaternary">None</p>
                    )}
                  </div>
                </div>
                
                <div className="section flex flex-col gap-1">
                  <p className="text-xs text-textColor-tertiary">Social Audit Held</p>
                  <div className="emoji-item flex gap-2 items-center">
                    <p className='w-4 text-sm'>⚖️</p>
                    {uniqueAudits.length ? (
                      <p>
                        {uniqueAudits.map((item, i) => (
                          <span key={i}>
                            {item}
                            {i !== uniqueAudits.length -1 && ", "}
                          </span>
                        ))}
                      </p>
                    ) : (
                      <p className="text-textColor-quaternary italic">None</p>
                    )}
                  </div>
                </div>

              </div>

              <div className="w-[1px] bg-[#F7F7F7] shrink-0"/>

              <div className="right flex-1 flex flex-col gap-6">
                <div>
                  <p className="text-xs text-textColor-quaternary mb-1">Notes</p>
                  <p className="text-xs text-textColor-secondary">
                    {v.vendorType && (<p>Type: {v.vendorType}</p>)}
                    {v.internalId && (<p>Internal ID: {v.internalId}</p>)}
                    {v.category && (<p>Category: {v.category}</p>)}
                    {v.ytdPurchases && (<p>YTD Purchases: {v.ytdPurchases}</p>)}
                    {v.purchasesLy && (<p>Last Year: {v.purchasesLy}</p>)}
                    {v.openPOs && (<p>Open POs: {v.openPOs}</p>)}
                    {v.terms && (<p>Terms: {v.terms}</p>)}
                    {v.factories && (<p>Factories: {v.factories}</p>)}
                  </p>
                </div>
                
                <div className="section">
                  <p className="text-xs text-textColor-quaternary mb-1">Capabilities</p>
                  <ul className="capabilities-table grid grid-cols-2 text-xs">
                    {v.productRange && v.productRange.split(',').map((product, i) => (
                      <li className="list-disc ml-4 -indent-[0.25rem] text-textColor-secondary mb-1">{product}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
