"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "cobephim-terms-accepted";

export function TermsModal() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem(STORAGE_KEY);
    if (!accepted) {
      const timer = setTimeout(() => setVisible(true), 400);
      return () => clearTimeout(timer);
    }
  }, []);

  function handleAccept() {
    localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="terms-overlay">
      <div className="terms-modal">
        {/* Shield icon */}
        <div className="terms-modal__icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
        </div>

        {/* BIG educational banner */}
        <div className="terms-modal__banner">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span>WEBSITE NÀY CHỈ NHẰM MỤC ĐÍCH HỌC TẬP</span>
        </div>
        <div className="terms-modal__banner-sub">
          KHÔNG PHỤC VỤ MỤC ĐÍCH THƯƠNG MẠI
        </div>

        {/* Body */}
        <div className="terms-modal__body">
          <p>
            Trang web này được xây dựng với mục đích <strong>học tập và nghiên cứu</strong> về
            công nghệ web (Next.js, MongoDB, crawl dữ liệu). Toàn bộ nội dung phim
            được lấy từ các nguồn API công khai và <strong>không lưu trữ trực tiếp</strong> bất kỳ
            tập tin video nào trên máy chủ.
          </p>
          <ul>
            <li>Không thu phí, không quảng cáo, không thương mại hóa</li>
            <li>Dữ liệu phim từ nguồn công khai, không tái phân phối</li>
            <li>Vui lòng không sử dụng vào mục đích vi phạm bản quyền</li>
          </ul>
          <p className="terms-modal__warning">
            Nếu bạn là chủ sở hữu bản quyền và không muốn nội dung xuất hiện,
            vui lòng liên hệ để được gỡ bỏ.
          </p>
        </div>

        {/* Accept button */}
        <button className="terms-modal__btn" onClick={handleAccept} type="button">
          Tôi đã hiểu và đồng ý
        </button>
      </div>
    </div>
  );
}
