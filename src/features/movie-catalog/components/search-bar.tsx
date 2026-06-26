import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

interface SearchBarProps {
  action?: string;
  defaultValue?: string;
  hiddenFields?: Record<string, string | number | undefined>;
  placeholder?: string;
}

export function SearchBar({
  action = "/tim-kiem",
  defaultValue = "",
  hiddenFields,
  placeholder = "Tìm kiếm phim, diễn viên",
}: SearchBarProps) {
  return (
    <form action={action} className="movie-search-form" method="get">
      <label className="movie-search-field">
        <SearchRoundedIcon aria-hidden="true" sx={{ fontSize: 20 }} />
        <input defaultValue={defaultValue} name="q" placeholder={placeholder} type="search" />
      </label>
      {hiddenFields
        ? Object.entries(hiddenFields).map(([key, value]) =>
            value ? <input key={key} name={key} type="hidden" value={String(value)} /> : null,
          )
        : null}
    </form>
  );
}
