import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Onboard from "../Components/Pages/Onboard";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />
    },
    {
        path: "/login",
        element: <Onboard />
    }
])


export default router