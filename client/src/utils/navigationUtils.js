import { startTransition } from "react-router-dom";

export const navigateWithTransition = (router, path) => {
  startTransition(() => {
    router.navigate(path);
  });
};
