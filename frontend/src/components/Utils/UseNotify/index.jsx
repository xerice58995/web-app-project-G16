import { useSnackbar } from "notistack";

export default function UseNotify() {
  const { enqueueSnackbar } = useSnackbar();

  const notify = (message, variant = "default") => {
    enqueueSnackbar(message, { variant });
  };

  return notify;
}
