import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Homepage from "../Components/Pages/Homepage";
import Onboard from "../Components/Pages/Onboard";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App element={<Homepage />} />
    },
    {
        path: "/login",
        element: <Onboard />
    }
])


export default router