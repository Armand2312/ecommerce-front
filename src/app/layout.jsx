import { CartContextProvider } from "@/components/CartContext";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Footer from "@/components/Footer";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-200">
        <aside aria-label="Portfolio demo notice" className="bg-blue-100 px-4 py-2 text-center text-sm text-blue-950">
          <strong>Portfolio demo</strong> · Payments use Stripe test mode. No real money is charged.
        </aside>
        <CartContextProvider>
          {children}
          <ToastContainer />
        </CartContextProvider>
        <Footer />
      </body>
    </html>
  );
}
