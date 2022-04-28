let abortController = undefined;

addEventListener("click", (event) => {
  if (abortController) {
    abortController.abort();
  }
  abortController = new AbortController();
  const { signal } = abortController;
  if (event.target instanceof HTMLButtonElement) {
    runPromise(copyText(event.target.textContent, { signal }));
  }
});

function runPromise(promise) {
  return promise.catch(() => null);
}

async function sleep(time, { signal }) {
  return new Promise((resolve, reject) => {
    function abort() {
      reject(new Error("Sleep aborted"));
    }
    signal.addEventListener("abort", abort);
    setTimeout(() => {
      resolve();
      signal.removeEventListener("abort", abort);
    }, time);
  });
}

async function copyText(text, { signal }) {
  const toast = document.querySelector("#toast");
  try {
    toast.hidden = false;
    await navigator.clipboard.writeText(text);
    toast.textContent = "Copied to clipboard";
    await sleep(2000, { signal });
    toast.hidden = true;
  } catch (err) {
    if (!signal.aborted) {
      console.error(err);
      toast.textContent = err.message;
    }
  }
}
