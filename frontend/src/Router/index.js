import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Homepage from "../Components/Pages/Homepage";
import Onboard from "../Components/Pages/Onboard";
import Profile from "../Components/Pages/Profile";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App element={<Homepage />} />
    },
    {
        path: "/:username",
        element: <App element={<Profile />} />
    },
    {
        path: "/login",
        element: <Onboard />
    }
])


export default router