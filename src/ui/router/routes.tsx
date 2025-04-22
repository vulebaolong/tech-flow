import { createHashRouter } from "react-router-dom";
import Home from "../page/home/Home";
import Test from "../page/test/Test";
import { ROUTER } from "../constant/router.constant";

const rootRouter = createHashRouter([
   {
      children: [
         {
            path: ROUTER.HOME,
            element: <Home />,
         },
         {
            path: ROUTER.TEST,
            element: <Test />,
         },
      ],
   },
]);

export default rootRouter;
