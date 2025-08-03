import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function BackToLanding() {
  const { t } = useTranslation();

  return (
    <div className="mt-8 text-center">
      <Link
        to="/"
        className="inline-flex items-center px-4 py-2 border border-transparent 
                  text-sm font-medium rounded-md shadow-sm text-blue-700 bg-blue-100 
                  hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 
                  focus:ring-blue-500 transition-colors duration-200"
        aria-label={t("back_to_landing_aria_label")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="-ml-1 mr-2 h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        {t("back_to_landing")}
      </Link>
    </div>
  );
}
