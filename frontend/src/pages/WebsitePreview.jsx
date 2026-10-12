import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  FaArrowLeft,
  FaExternalLinkAlt,
  FaCode,
} from "react-icons/fa";

import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  getPortfolioBySlug,
} from "../Features/portfolio.js";
import WebsiteCodeModal from "../components/Resume/Portfolio/WebsiteCodeModal.jsx";

export default function WebsitePreview() {
  
  
  

  const { id: slug } = useParams();

  const location = useLocation();

  const navigate = useNavigate();

  const iframeRef = useRef(null);

  
  
  

  const currentPortfolio = useSelector(
    (state) =>
      state.portfolio?.currentPortfolio
  );

  
  
  

  const [portfolio, setPortfolio] =
    useState(
      location.state?.portfolio ||
        null
    );

  const [isLoading, setIsLoading] =
    useState(true);

  const [loadError, setLoadError] =
    useState("");

  const [isReady, setIsReady] =
    useState(false);

  const [
    showCodeModal,
    setShowCodeModal,
  ] = useState(false);

  // ============================================================
  // LOAD PORTFOLIO
  // ============================================================

  useEffect(() => {
    let mounted = true;

    const loadPortfolio = async () => {
      try {
        setIsLoading(true);
        setLoadError("");

        // ------------------------------------------------------
        // LOCATION STATE
        // ------------------------------------------------------

        const statePortfolio =
          location.state?.portfolio;

        if (
          statePortfolio?.generatedCode
            ?.html
        ) {
          if (mounted) {
            setPortfolio(
              statePortfolio
            );

            setIsLoading(false);
          }

          return;
        }

        // ------------------------------------------------------
        // REDUX
        // ------------------------------------------------------

        if (
          currentPortfolio?.slug ===
            slug &&
          currentPortfolio
            ?.generatedCode?.html
        ) {
          if (mounted) {
            setPortfolio(
              currentPortfolio
            );

            setIsLoading(false);
          }

          return;
        }

        // ------------------------------------------------------
        // VALIDATE SLUG
        // ------------------------------------------------------

        if (!slug) {
          throw new Error(
            "Portfolio slug is missing"
          );
        }

        console.log(
          "Fetching portfolio:",
          slug
        );

        
        
        

        const response =
          await getPortfolioBySlug(
            slug
          );

        console.log(
          "Portfolio Detail:",
          response
        );

        if (
          !response?.success ||
          !response?.portfolio
        ) {
          throw new Error(
            response?.message ||
              "Portfolio not found"
          );
        }

        if (mounted) {
          setPortfolio(
            response.portfolio
          );
        }
      } catch (error) {
        console.error(
          "Load Portfolio Error:",
          error
        );

        if (mounted) {
          const message =
            error?.response?.data
              ?.message ||
            error?.message ||
            "Failed to load portfolio";

          setLoadError(message);

          toast.error(message);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadPortfolio();

    return () => {
      mounted = false;
    };
  }, [
    slug,
    location.state,
    currentPortfolio,
  ]);

  
  
  

  const generatedCode =
    portfolio?.generatedCode || {};

  const html =
    generatedCode?.html || "";

  const css =
    generatedCode?.css || "";

  const js =
    generatedCode?.js || "";

  // ============================================================
  // BUILD COMPLETE DOCUMENT
  // ============================================================

  const documentHtml = useMemo(() => {
    if (!html) {
      return "";
    }

    let finalHtml = html;

    // ----------------------------------------------------------
    // CSS
    // ----------------------------------------------------------

    if (css) {
      const styleTag = `
<style>
${css}
</style>
`;

      if (
        /<\/head>/i.test(
          finalHtml
        )
      ) {
        finalHtml =
          finalHtml.replace(
            /<\/head>/i,
            `${styleTag}</head>`
          );
      } else {
        finalHtml =
          styleTag + finalHtml;
      }
    }

    // ----------------------------------------------------------
    // JAVASCRIPT
    // ----------------------------------------------------------

    if (js) {
      const scriptTag = `
<script>
${js}
</script>
`;

      if (
        /<\/body>/i.test(
          finalHtml
        )
      ) {
        finalHtml =
          finalHtml.replace(
            /<\/body>/i,
            `${scriptTag}</body>`
          );
      } else {
        finalHtml +=
          scriptTag;
      }
    }

    return finalHtml;
  }, [html, css, js]);

  // ============================================================
  // IFRAME
  // ============================================================

  const handleIframeLoad = () => {
    setIsReady(true);
  };

  // ============================================================
  // OPEN WEBSITE
  // ============================================================

  const openInNewTab = () => {
    if (!documentHtml) {
      toast.error(
        "Website code is not available"
      );

      return;
    }

    const blob = new Blob(
      [documentHtml],
      {
        type: "text/html",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const newWindow =
      window.open(
        url,
        "_blank",
        "noopener,noreferrer"
      );

    if (!newWindow) {
      toast.error(
        "Please allow popups for this website"
      );
    }

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 30000);
  };

  
  
  

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950">
        <div className="text-center">

          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />

          <h2 className="text-lg font-semibold text-white">
            Loading portfolio...
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Preparing your generated website
          </p>

        </div>
      </div>
    );
  }

  
  
  

  if (loadError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">

        <div className="max-w-lg text-center">

          <h1 className="text-2xl font-bold text-white">
            Portfolio not found
          </h1>

          <p className="mt-3 text-gray-400">
            {loadError}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/all-portfolio"
              )
            }
            className="mt-7 rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:bg-gray-200"
          >
            Back to Websites
          </button>

        </div>
      </div>
    );
  }

  
  
  

  if (!portfolio) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950">

        <div className="text-center">

          <h1 className="text-2xl font-bold text-white">
            Portfolio not found
          </h1>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/all-portfolio"
              )
            }
            className="mt-6 rounded-xl bg-white px-6 py-3 font-semibold text-black"
          >
            Back to Websites
          </button>

        </div>

      </div>
    );
  }

  
  
  

  if (!html) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">

        <div className="max-w-lg text-center">

          <h1 className="text-2xl font-bold text-white">
            Website code unavailable
          </h1>

          <p className="mt-3 text-gray-400">
            This portfolio exists, but
            generated HTML was not found.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/all-portfolio"
              )
            }
            className="mt-7 rounded-xl bg-white px-6 py-3 font-semibold text-black"
          >
            Back to Websites
          </button>

        </div>

      </div>
    );
  }

  
  
  

  return (
    <div className="flex h-screen flex-col bg-neutral-950">

      {}

      <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 bg-neutral-950 px-4 sm:px-5">

        {}

        <div className="flex min-w-0 items-center gap-3 sm:gap-4">

          <button
            type="button"
            onClick={() =>
              navigate(
                "/all-portfolio"
              )
            }
            className="flex shrink-0 items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/10 sm:px-4"
          >
            <FaArrowLeft />

            <span className="hidden sm:inline">
              Back
            </span>
          </button>

          <div className="hidden h-6 w-px bg-white/10 sm:block" />

          <div className="min-w-0">

            <h1 className="truncate text-sm font-semibold text-white sm:max-w-[300px]">
              {portfolio.title ||
                "My Portfolio"}
            </h1>

            <p className="text-xs text-gray-500">
              Portfolio Preview
            </p>

          </div>
        </div>

        {}

        <div className="flex items-center gap-2 sm:gap-3">

          {isReady && (
            <span className="hidden text-xs text-green-400 md:block">
              ● Website Ready
            </span>
          )}

          {}

          <button
            type="button"
            onClick={() =>
              setShowCodeModal(true)
            }
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/10 sm:px-4"
          >
            <FaCode />

            <span className="hidden sm:inline">
              Code View
            </span>
          </button>

          {}

          <button
            type="button"
            onClick={
              openInNewTab
            }
            className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-black transition hover:bg-gray-200 sm:px-4"
          >
            <FaExternalLinkAlt />

            <span className="hidden sm:inline">
              Open Website
            </span>
          </button>

        </div>
      </header>

      {}

      <main className="relative min-h-0 flex-1 overflow-hidden bg-white">

        {!isReady && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-neutral-950">

            <div className="text-center">

              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />

              <p className="text-sm text-gray-400">
                Loading your portfolio...
              </p>

            </div>
          </div>
        )}

        <iframe
          ref={iframeRef}
          title={
            portfolio.title ||
            "Portfolio Preview"
          }
          srcDoc={documentHtml}
          onLoad={
            handleIframeLoad
          }
          className="h-full w-full border-0"
          sandbox="allow-scripts allow-forms allow-popups allow-modals"
        />

      </main>

      {}

      <WebsiteCodeModal
        portfolio={portfolio}
        isOpen={showCodeModal}
        onClose={() =>
          setShowCodeModal(false)
        }
      />

    </div>
  );
}