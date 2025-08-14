interface ActiveAuditCountProps {
  count: number;
  className?: string;
}

export default function ActiveAuditCount({ count, className = "" }: ActiveAuditCountProps) {
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full ${className}`} style={{ backgroundColor: '#AFFDC3', border: '1px solid black' }}>
      <span className="text-sm font-medium text-gray-900">
        {count} Active Scan{count !== 1 ? 's' : ''}
      </span>
      <svg width="20px" height="20px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" id="scan-alt" className="icon glyph" fill="#000000" transform="rotate(90)">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          <path d="M8,22H4a2,2,0,0,1-2-2V16a1,1,0,0,1,2,0v4H8a1,1,0,0,1,0,2Z" style={{fill:"#231f20"}}></path>
          <path d="M20,22H16a1,1,0,0,1,0-2h4V16a1,1,0,0,1,2,0v4A2,2,0,0,1,20,22Z" style={{fill:"#231f20"}}></path>
          <path d="M8,22H4a2,2,0,0,1-2-2V16a1,1,0,0,1,2,0v4H8a1,1,0,0,1,0,2Z" style={{fill:"#231f20"}}></path>
          <path d="M3,9A1,1,0,0,1,2,8V4A2,2,0,0,1,4,2H8A1,1,0,0,1,8,4H4V8A1,1,0,0,1,3,9Z" style={{fill:"#231f20"}}></path>
          <path d="M21,9a1,1,0,0,1-1-1V4H16a1,1,0,0,1,0-2h4a2,2,0,0,1,2,2V8A1,1,0,0,1,21,9Z" style={{fill:"#231f20"}}></path>
          <path d="M12,17a1,1,0,0,1-1-1V8a1,1,0,0,1,2,0v8A1,1,0,0,1,12,17Z" style={{fill:"#231f20"}}></path>
          <path d="M8,15a1,1,0,0,1-1-1V10a1,1,0,0,1,2,0v4A1,1,0,0,1,8,15Z" style={{fill:"#231f20"}}></path>
          <path d="M16,15a1,1,0,0,1-1-1V10a1,1,0,0,1,2,0v4A1,1,0,0,1,16,15Z" style={{fill:"#231f20"}}></path>
        </g>
      </svg>
        
      </div>
  );
}
