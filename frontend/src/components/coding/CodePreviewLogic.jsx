import { useCallback, useEffect } from "react";

export default function CodePreviewLogic({
  iframeRef,
  executionTimerRef,
  latestCode,
  setIsLoading,
  setError,
  isFullscreen,
  setIsFullscreen,
  setCopied,
}) {
  
  
  

  const executeCode = useCallback(() => {
    const iframe = iframeRef.current;

    if (!latestCode) {
      setError("No previewable code found.");
      return;
    }

    if (!iframe) {
      setError("Preview iframe is not available.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const doc =
        iframe.contentDocument ||
        iframe.contentWindow?.document;

      if (!doc) {
        throw new Error("Unable to access iframe document.");
      }

      
      doc.open();
      doc.write(latestCode.code);
      doc.close();

      
      iframe.src = "about:blank";

      setTimeout(() => {
        const newDoc =
          iframe.contentDocument ||
          iframe.contentWindow?.document;

        if (newDoc) {
          newDoc.open();
          newDoc.write(latestCode.code);
          newDoc.close();
        }

        setIsLoading(false);
      }, 100);
    } catch (err) {
      console.error(
        "Code preview execution error:",
        err,
      );

      setError(
        err?.message ||
          "Unable to execute preview.",
      );

      setIsLoading(false);
    }
  }, [
    latestCode,
    iframeRef,
    setError,
    setIsLoading,
  ]);

  
  
  

  useEffect(() => {
    if (!latestCode) {
      return;
    }

    if (executionTimerRef.current) {
      clearTimeout(
        executionTimerRef.current,
      );
    }

    executionTimerRef.current =
      window.setTimeout(() => {
        executeCode();
      }, 300);

    return () => {
      if (executionTimerRef.current) {
        clearTimeout(
          executionTimerRef.current,
        );
      }
    };
  }, [
    latestCode,
    executeCode,
    executionTimerRef,
  ]);

  
  
  

  const handleCopy = async () => {
    if (!latestCode?.code) {
      return;
    }

    try {
      if (
        navigator.clipboard &&
        navigator.clipboard.writeText
      ) {
        await navigator.clipboard.writeText(
          latestCode.code,
        );
      } else {
        const textarea =
          document.createElement("textarea");

        textarea.value = latestCode.code;

        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";

        document.body.appendChild(
          textarea,
        );

        textarea.focus();
        textarea.select();

        document.execCommand("copy");

        document.body.removeChild(
          textarea,
        );
      }

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (err) {
      console.error(
        "Copy failed:",
        err,
      );
    }
  };

  
  
  

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.key === "Escape" &&
        isFullscreen
      ) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    isFullscreen,
    setIsFullscreen,
  ]);

  return {
    executeCode,
    handleCopy,
  };
}