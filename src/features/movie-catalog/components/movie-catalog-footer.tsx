export function MovieCatalogFooter() {
  return (
    <footer className="movie-catalog-footer">
      <div className="movie-catalog-footer__inner">
        <div>
          <strong>CobePhim Movie Platform</strong>
          <p>Dữ liệu phim được crawl về MongoDB, video chỉ nhúng từ nguồn gốc, không host lại.</p>
        </div>
        <div>
          <span>Next.js App Router</span>
          <span>MongoDB + Mongoose</span>
          <span>OPhim + darkbytes source</span>
        </div>
      </div>
    </footer>
  );
}
