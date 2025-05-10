'use client';

import cx from 'classnames';
import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import type { Vendor as VendorType } from '@/lib/db/schema';
import VendorData3 from './vendor-data-3';
import { VendorSkeletonCard } from './vendor-skeleton-card'; // Import the skeleton card

export function Vendor({ companies }: { companies?: VendorType[] | null }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    console.log('🛠 Vendor prop companies:', companies);
  }, [companies]);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize(); // Call on initial render
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // If companies is undefined, it means the data is likely still loading
  // (because the 'call' state of the tool rendered <Vendor /> without props).
  // If companies is null, it could mean an error or explicitly no data from the tool result.
  // If companies is an empty array, it means the tool returned successfully but found no vendors.
  if (companies === undefined) {
    return <VendorSkeletonCard />;
  }

  let displayList: VendorType[];

  if (Array.isArray(companies)) {
    displayList = companies;
  } else {
    // companies is null, undefined, or not an array.
    // Treat as empty for rendering, rather than showing sample data.
    displayList = [];
  }


  return (
    <div className="flex flex-col gap-3">
      {displayList.map((v) => {
        // ... (rest of your component rendering logic remains the same)
        const auditItems = v.audits ? v.audits.split(',') : [];
        const socialAuditItems = v.relevant3RdPartySocialAudit ? v.relevant3RdPartySocialAudit.split(',') : [];
        const uniqueAudits = [...new Set([...auditItems, ...socialAuditItems])];
        const name = v.vendorName ?? '—';

        return (
          <div
            key={v.id}
            className={cx(
              'flex items-start gap-3 rounded-[28px] px-6 py-[20px] w-full max-w-[1000px]', // max-w-[1000px] is on the outer card
              'bg-white shadow-[0_1px_2px_rgba(0,0,0,0.2)] border border-black/3'
            )}
          >
            {/* Main content flex container */}
            <div className="flex-1 flex flex-row gap-5 w-full"> {/* Ensure this inner container takes full width */}
              
              {/* Left Column - FIXED WIDTH */}
              <div
                className="left flex flex-col gap-2 w-36 shrink-0" // Use w-72 (288px) or your desired fixed width. `shrink-0` prevents shrinking.
              >
                <div className="title mb-1">
                  {v.vendorName ? (
                    <h3 className="text-textColor-primary text-base font-semibold break-words">{name}</h3>
                  ) : (
                    <h3 className="text-textColor-tertiary text-base font-semibold italic">Unknown Vendor Name</h3>
                  )}

                  {v.factoryName ? (
                    <h4 className="text-textColor-secondary text-sm lowercase break-words">{v.factoryName}</h4>
                  ) : (
                    <h4 className="text-textColor-quaternary italic text-sm">{'Factory Name Unknown'}</h4>
                  )}
                </div>

                {/* Vendor Details Section */}
                <div className="section flex flex-col gap-1">
                  <p className="text-xs text-textColor-tertiary">Vendor Details</p>
                  <div className="emoji-item flex gap-1 items-start"> {/* Changed to items-start for long text */}
                    <p className='w-3 text-xs shrink-0'>📍</p> {/* shrink-0 for emoji */}
                    {(v.country || v.city) ? (
                      <p className="text-xs break-words"> {/* break-words for long city/country names */}
                        {v.city && v.country ? `${v.city}, ${v.country}` : v.country || v.city}
                      </p>
                    ) : (
                      <p className="italic text-textColor-quaternary text-xs">None</p>
                    )}
                  </div>
                  <div className="emoji-item flex gap-1 items-start">
                    <p className='w-3 text-xs shrink-0'>💼</p>
                    {v.name ? (
                      <p className="text-xs break-words">{v.name}</p>
                    ) : (
                      <p className="italic text-textColor-quaternary text-xs">None</p>
                    )}
                  </div>
                  <div className="emoji-item flex gap-1 items-start">
                    <p className='w-3 text-xs shrink-0'>✉️</p>
                    {v.email ? (
                      <p className="text-xs break-all">{v.email}</p> 
                    ) : (
                      <p className="italic text-textColor-quaternary text-xs">None</p>
                    )}
                  </div>
                  <div className="emoji-item flex gap-1 items-start">
                    <p className='w-3 text-xs shrink-0'>📞</p>
                    {(v.phone && v.phone !== v.email) ? (
                      <p className="text-xs break-words">{v.phone}</p>
                    ) : (
                      <p className="italic text-textColor-quaternary text-xs">None</p>
                    )}
                  </div>
                </div>
                
                {/* Certifications Section */}
                <div className="section flex flex-col gap-1">
                  <p className="text-xs text-textColor-tertiary">Certifications Held</p>
                  <div className="emoji-item flex gap-1 items-start">
                    <p className='w-3 text-xs shrink-0'>🏅</p>
                    {v.certificates ? (
                      <p className="text-xs break-words">{v.certificates}</p>
                    ) : (
                      <p className="italic text-textColor-quaternary text-xs">None</p>
                    )}
                  </div>
                </div>
                
                {/* Social Audit Section */}
                <div className="section flex flex-col gap-1">
                  <p className="text-xs text-textColor-tertiary">Social Audit Held</p>
                  <div className="emoji-item flex gap-1 items-start">
                    <p className='w-3 text-xs shrink-0'>⚖️</p>
                    {uniqueAudits.length ? (
                      <p className="text-xs break-words"> {/* break-words for long audit lists */}
                        {uniqueAudits.map((item, i) => (
                          <span key={i}>
                            {item}
                            {i !== uniqueAudits.length - 1 && ", "}
                          </span>
                        ))}
                      </p>
                    ) : (
                      <p className="text-textColor-quaternary italic text-xs">None</p>
                    )}
                  </div>
                </div>
              </div> {/* End Left Column */}

              {/* Vertical Separator */}
              <div className="w-[1px] bg-[#F7F7F7] shrink-0"/>

              {/* Center Column - FLEXIBLE */}
              <div className="center flex-1 flex flex-col gap-4 min-w-0"> {/* min-w-0 helps flex items shrink correctly if needed */}
                <div>
                  <p className="text-xs text-textColor-quaternary mb-1">Notes</p>
                  <div className="text-[10px] text-textColor-secondary space-y-0.5"> {/* Added space-y for slight separation */}
                    {v.vendorType && (<p className="break-words">Type: {v.vendorType}</p>)}
                    {v.internalId && (<p>Internal ID: {v.internalId}</p>)}
                    {v.category && (<p className="break-words">Category: {v.category}</p>)}
                    {v.ytdPurchases && (<p>YTD Purchases: {v.ytdPurchases}</p>)}
                    {v.purchasesLy && (<p>Last Year: {v.purchasesLy}</p>)}
                    {v.openPOs && (<p>Open POs: {v.openPOs}</p>)}
                    {v.terms && (<p className="break-words">Terms: {v.terms}</p>)}
                    {v.factories && (<p className="break-words">Factories: {v.factories}</p>)}
                  </div>
                </div>
                
                <div className="section">
                  <p className="text-xs text-textColor-quaternary mb-1">Capabilities</p>
                  {v.productRange && v.productRange.trim() !== "" ? (
                    <ul className="capabilities-table grid grid-cols-2 gap-x-2 text-[10px]"> {/* Added gap-x for space between columns */}
                      {v.productRange.split(',').map((product, i) => (
                        <li
                          key={i}
                          className="list-disc list-inside text-textColor-secondary mb-1 break-words" // list-inside might look better
                          // style={{ wordBreak: "break-word", overflowWrap: "anywhere", hyphens: "auto" }} // Already handled by break-words
                        >{product.trim()}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="italic text-textColor-quaternary text-[10px]">None listed</p>
                  )}
                </div>
              </div> {/* End Center Column */}
              
              {/* Right Column (VendorData3) - FIXED WIDTH (already handled by its internal style) */}
              <div className="shrink-0"> {/* Add shrink-0 to prevent this column from shrinking */}
                <VendorData3 country={v.country} />
              </div>

            </div> {/* End Main content flex container */}
          </div>
        );
      })}
    </div>
  );
}