import { CartContextProvider } from "@/components/CartContext";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-200">

        <CartContextProvider>
          {children}
          <ToastContainer />
        </CartContextProvider>

      </body>
    </html>
  );
}
