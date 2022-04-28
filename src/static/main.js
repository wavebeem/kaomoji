let abortController = undefined;

addEventListener("click", (event) => {
  if (!(event.target instanceof HTMLButtonElement)) {
    return;
  }
  if (abortController) {
    abortController.abort();
  }
  abortController = new AbortController();
  const { signal } = abortController;
  runPromise(copyText(event.target.dataset.text, { signal }));
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
    toast.textContent = `Copied ${text}`;
    await sleep(2000, { signal });
    toast.hidden = true;
  } catch (err) {
    if (!signal.aborted) {
      console.error(err);
      toast.textContent = err.message;
    }
  }
}
