import { RouterProvider } from "react-router-dom";
import rootRouter from "./router/routes";

function App() {
   return (
      <>
         <RouterProvider router={rootRouter} />
      </>
   );
}

export default App;

// # 1. Gỡ hạn chế bảo mật Gatekeeper (cho phép mở app)
// sudo xattr -r -d com.apple.quarantine "/Applications/Capcut Automation.app"

// # 2. Chạy ứng dụng từ terminal (chạy file thực thi trong app bundle)
// /Applications/Capcut\ Automation.app/Contents/MacOS/Capcut\ Automation
