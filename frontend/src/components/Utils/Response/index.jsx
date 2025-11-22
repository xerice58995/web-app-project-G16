export const handleResponse = (response, successMessageOverride = null, notify) => {
  const data = response.data;
  if (data.code === 1) {
    notify(successMessageOverride || data.message, "success");
  } else {
    notify(data.message, "error");
  }
};

export const handleError = (error, defaultMsg, notify) => {
  const msg = error.response?.data?.message || defaultMsg;
  notify(msg, "error");
};
